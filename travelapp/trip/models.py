
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.gis.db import models as geomodels
from django.db import models
from django.db.models import TextChoices
from django.core.exceptions import ValidationError
import subprocess
from PIL import Image
import mimetypes


RATING_CHOICES = [(str(i), i) for i in range(1, 6)]


class Media(models.Model):
    class MediaTypeChoices(TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'

    file = models.FileField(upload_to='media_uploads/', blank=True, null=True, verbose_name="Media File")
    media_type = models.CharField(
        max_length=5, choices=MediaTypeChoices.choices, default=MediaTypeChoices.IMAGE, verbose_name="Media Type"
    )
    caption = models.CharField(max_length=255, blank=True, null=True, verbose_name="Caption")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, verbose_name="Content Type")
    object_id = models.PositiveIntegerField(verbose_name="Object ID")
    content_object = GenericForeignKey('content_type', 'object_id')

    def clean(self):
        if self.file:
            mime_type, _ = mimetypes.guess_type(self.file.name)
            if self.media_type == self.MediaTypeChoices.IMAGE and not mime_type.startswith('image'):
                raise ValidationError("File is not an image.")
            elif self.media_type == self.MediaTypeChoices.VIDEO and not mime_type.startswith('video'):
                raise ValidationError("File is not a video.")

    def resize_image(self, target_width=1280, target_height=720):
        if not self.file:
            return None

        from PIL import Image

        image = Image.open(self.file)
        width, height = image.size

        # Resize the image to fit within the target dimensions while maintaining aspect ratio
        image.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)

        # Create a new blank image with the target dimensions
        new_image = Image.new("RGB", (target_width, target_height), (0, 0, 0))  # Black background
        new_image.paste(
            image,
            (
                (target_width - image.size[0]) // 2,  # Center horizontally
                (target_height - image.size[1]) // 2,  # Center vertically
            ),
        )

    # Save the resized image
        self.file.name = f"{self.file.name.rsplit('.', 1)[0]}_resized.{self.file.name.rsplit('.', 1)[-1]}"
        new_image.save(self.file.path)

    def resize_video(self, target_width=1280, target_height=720):
        if not self.file:
            return None

        input_path = self.file.path
        output_path = f"{self.file.path.rsplit('.', 1)[0]}_resized.{self.file.path.rsplit('.', 1)[-1]}"

        # Use ffmpeg to resize the video to the target resolution
        command = [
            'ffmpeg',
            '-i', input_path,
            '-vf', f"scale={target_width}:{target_height}:force_original_aspect_ratio=decrease,pad={target_width}:{target_height}:(ow-iw)/2:(oh-ih)/2",  # Resize and pad to fit
            '-c:a', 'copy',
            output_path
        ]

        result = subprocess.run(command, capture_output=True)
        if result.returncode == 0:
            self.file.name = output_path.split('/')[-1]
        else:
            print(f"Error resizing video: {result.stderr.decode()}")

    def save(self, *args, **kwargs):
        if self.media_type == self.MediaTypeChoices.IMAGE:
            self.resize_image()
        elif self.media_type == self.MediaTypeChoices.VIDEO:
            self.resize_video()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.media_type.capitalize()} - {self.caption or 'Untitled'}"

    class Meta:
        verbose_name = "Media"
        verbose_name_plural = "Media"


class Trip(models.Model):
    class BestTimeToVisitChoices(TextChoices):
        SUMMER = 'Summer', 'Summer'
        WINTER = 'Winter', 'Winter'
        SPRING = 'Spring', 'Spring'
        AUTUMN = 'Autumn', 'Autumn'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips', verbose_name="User")
    title = models.CharField(max_length=255, blank=True, verbose_name="Title")
    days = models.PositiveIntegerField(default=0, verbose_name="Days")
    nights = models.PositiveIntegerField(default=0, verbose_name="Nights")
    starting_location = models.CharField(max_length=255, verbose_name="Starting Location")
    location = geomodels.PointField(blank=True, null=True, verbose_name="Location")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Cost")
    image_cover = models.ImageField(upload_to='trips/', verbose_name="Cover Image")
    location=geomodels.PointField(blank=True, null=True, verbose_name="Location")
    media = GenericRelation(Media, related_query_name='trip')
    best_time_to_visit = models.CharField(
        max_length=100, choices=BestTimeToVisitChoices.choices, null=True, verbose_name="Best Time to Visit"
    )
    emergency_numbers = models.CharField(max_length=255, verbose_name="Emergency Numbers")
    currency_used = models.CharField(max_length=255, verbose_name="Currency Used")
    language_spoken = models.CharField(max_length=255, blank=True, verbose_name="Language Spoken")
    number_of_people = models.PositiveIntegerField(default=1, verbose_name="Number of People")
    description = models.TextField(blank=True, null=True, verbose_name="Description")

    def __str__(self):
        return self.title or f"Trip by {self.user.username}"

    @property
    def total_cost(self):
        activities_cost = sum(activity.cost for activity in self.activities.all())
        hotels_cost = sum(hotel.cost for hotel in self.hotels.all())
        restaurants_cost = sum(restaurant.cost for restaurant in self.restaurants.all())
        transport_cost = sum(transport.cost or 0 for transport in self.transport.all())
        return self.cost + activities_cost + hotels_cost + restaurants_cost + transport_cost

    class Meta:
        verbose_name = "Trip"
        verbose_name_plural = "Trips"


class PlaceVisited(models.Model):
    class BestTimeToVisitChoices(TextChoices):
        MORNING = 'Morning', 'Morning'
        AFTERNOON = 'Afternoon', 'Afternoon'
        EVENING = 'Evening', 'Evening'

    name = models.CharField(max_length=255, verbose_name="Name")
    cover_image = models.ImageField(upload_to='places_visited/', blank=True, null=True, verbose_name="Cover Image")
    trip = models.ForeignKey(Trip, related_name='places_visited', on_delete=models.CASCADE, verbose_name="Trip")
    coordinates = geomodels.PointField(blank=True, null=True, verbose_name="Coordinates")
    description = models.TextField(verbose_name="Description")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Cost")
    # best_time_to_visit = models.CharField(
    #     max_length=50, choices=BestTimeToVisitChoices.choices, null=True, verbose_name="Best Time to Visit"
    # )
    best_time_to_visit = models.CharField(max_length=50,blank=True,null=True, verbose_name="Best Time to Visit")
    media = GenericRelation(Media, related_query_name='placevisited')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Place Visited"
        verbose_name_plural = "Places Visited"


class ModeOfTransport(models.Model):
    class ModeChoices(TextChoices):
        CAR = 'Car', 'Car'
        BUS = 'Bus', 'Bus'
        TRAIN = 'Train', 'Train'
        FLIGHT = 'Flight', 'Flight'
        WALKING = 'Walking', 'Walking'
        BICYCLE = 'Bicycle', 'Bicycle'
        BOAT = 'Boat', 'Boat'
        OTHER = 'Other', 'Other'

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='transport', verbose_name="Trip")
    mode = models.CharField(max_length=20, choices=ModeChoices.choices, verbose_name="Mode")
    duration = models.DurationField(blank=True, null=True, verbose_name="Duration")
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Cost")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    places_visited = models.ManyToManyField(PlaceVisited, related_name='visited_by_transport', blank=True, verbose_name="Places Visited")
    media = GenericRelation(Media, related_query_name='transport')

    likes = models.ManyToManyField(
    settings.AUTH_USER_MODEL,
    related_name='liked_trips',
    blank=True
    )

    # Helper methods
    def like_count(self):
        return self.likes.count()

    def is_liked_by(self, user):
        return self.likes.filter(pk=user.pk).exists() if user.is_authenticated else False
    
    def __str__(self):
        return f"{self.mode} ({self.duration or 'N/A'})"

    class Meta:
        verbose_name = "Mode of Transport"
        verbose_name_plural = "Mode of Transport"


class Activity(models.Model):
    class BestTimeToVisitChoices(TextChoices):
        MORNING = 'Morning', 'Morning'
        AFTERNOON = 'Afternoon', 'Afternoon'
        EVENING = 'Evening', 'Evening'

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities', verbose_name="Trip")
    name = models.CharField(max_length=255, verbose_name="Name")
    cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cost")
    location = geomodels.PointField(blank=True, null=True, verbose_name="Location")
    description = models.TextField(max_length=255, verbose_name="Description")
    media = GenericRelation(Media, related_query_name='activity')
    
    # best_time_to_visit = models.CharField(
    #     max_length=50, choices=BestTimeToVisitChoices.choices, null=True, verbose_name="Best Time to Visit"
    # )
    best_time_to_visit = models.CharField(max_length=50,blank=True,null=True,verbose_name="Best Time to Visit")
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Activity"
        verbose_name_plural = "Activities"


class Hotel(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='hotels', verbose_name="Trip")
    name = models.CharField(max_length=255, verbose_name="Name")
    cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cost")
    rooms_booked = models.PositiveIntegerField(verbose_name="Rooms Booked")
    location = geomodels.PointField(blank=True, null=True, verbose_name="Location")
    rating=models.CharField(max_length=100, choices=RATING_CHOICES,blank=True,null=True)
    media = GenericRelation(Media, related_query_name='hotel')
    description=models.TextField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Hotel"
        verbose_name_plural = "Hotels"


class Restaurant(models.Model):
    class MealTypeChoices(TextChoices):
        BREAKFAST = 'Breakfast', 'Breakfast'
        LUNCH = 'Lunch', 'Lunch'
        DINNER = 'Dinner', 'Dinner'

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='restaurants', verbose_name="Trip")
    name = models.CharField(max_length=255, verbose_name="Name")
    cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cost")
    meal_type = models.CharField(max_length=100, null=True,blank=True, verbose_name="Meal Type")
    location=geomodels.PointField(blank=True, null=True, verbose_name="Location")
    media = GenericRelation(Media, related_query_name='restaurant')
    rating=models.CharField(max_length=100, choices=RATING_CHOICES,blank=True,null=True)
    description=models.TextField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Restaurant"
        verbose_name_plural = "Restaurants"

