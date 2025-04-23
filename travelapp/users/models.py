from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, phone_number=None, password=None, **extra_fields):
        # If it's a superuser, we don't require email or phone_number
        if extra_fields.get('is_superuser'):
            email = None
            phone_number = None
        else:
            # Regular user requires email and phone_number
            if not email:
                raise ValueError(_("The Email field must be set"))
            if not phone_number:
                raise ValueError(_("The Phone Number field must be set"))

            email = self.normalize_email(email)

        extra_fields.setdefault('is_active', True)  # Typically, users are active by default
        user = self.model(email=email, phone_number=phone_number, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, phone_number=None, password=None, **extra_fields):
        # Superuser should only require username
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        # Call create_user with None for email and phone_number since they're not required for superuser
        return self.create_user(username=username, email=email, phone_number=phone_number, password=password, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, blank=True, null=True)  # Make email optional for superusers
    phone_number = models.CharField(
        max_length=15,
        unique=True,
        validators=[RegexValidator(regex=r'^\+\d{1,14}$', message=_("Enter a valid phone number."))],
        blank=True, null=True  # Make phone_number optional for superusers
    )
    username = models.CharField(max_length=150, unique=True)  # Make username the primary identifier
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        default="profile_pictures/default.jpg",
        blank=True
    )
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_generated_at = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'  # Use username as the login field
    REQUIRED_FIELDS = []  # No required fields for superuser, just username

    def __str__(self):
        return self.username
