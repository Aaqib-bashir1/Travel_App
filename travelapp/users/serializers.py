from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ["username",'email', 'phone_number', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class EmailActivationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()

class PhoneVerificationSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
   


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "profile_picture",
            "date_joined",
        ]


class UpdateProfileSerializer(serializers.ModelSerializer):
    # Optional profile picture field to handle image uploads
    profile_picture = serializers.ImageField(required=False)  # This allows users to not upload a picture

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "profile_picture"]

    def update(self, instance, validated_data):
        # Handle updating the profile fields
        # If a profile picture is provided, update it
        profile_picture = validated_data.get('profile_picture', None)
        if profile_picture:
            instance.profile_picture = profile_picture
        
        # Update other fields if provided
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        instance.save()  # Save the updated instance to the database
        return instance