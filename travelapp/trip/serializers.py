


# from rest_framework import serializers
# from .models import Trip, Hotel, PlaceVisited, Activity, Restaurant, Media, ModeOfTransport

# class MediaSerializer(serializers.ModelSerializer):
#     file = serializers.SerializerMethodField()

#     class Meta:
#         model = Media
#         fields = ['id', 'file', 'media_type', 'caption']

#     def get_file(self, obj):
#         return obj.file.url if obj.file else None

# class PlaceVisitedSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = PlaceVisited
#         # fields = ['id', 'name', 'description', 'cost', 'best_time_to_visit', 'safety_tips', 'coordinates', 'media']
#         fields='__all__'

# class ActivitySerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)
#     # places_visited = serializers.SerializerMethodField()

#     class Meta:
#         model = Activity
#         fields = ['id', 'name', 'cost', 'description', 'review',  'media']

#     # def get_places_visited(self, obj):
#     #     # Ensure you're using the correct reverse relationship for 'places_visited'
#     #     return [place.name for place in obj.places_visited.all()]

# class HotelSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)
#     # places_visited = serializers.SerializerMethodField()

#     class Meta:
#         model = Hotel
#         fields = ['id', 'name', 'cost', 'review', 'description', 'rooms_booked', 'coordinates', 'media']

#     # def get_places_visited(self, obj):
#     #     # Ensure you're using the correct reverse relationship for 'places_visited'
#     #     return [place.name for place in obj.places_visited.all()]

# class RestaurantSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)
#     # places_visited = serializers.SerializerMethodField()

#     class Meta:
#         model = Restaurant
#         fields = ['id', 'name', 'things_to_try', 'cost', 'meal_type', 'review', 'description', 'coordinates',  'media']

#     # def get_places_visited(self, obj):
#     #     # Ensure you're using the correct reverse relationship for 'places_visited'
#     #     return [place.name for place in obj.places_visited.all()]
    

# class TripSerializer(serializers.ModelSerializer):
#     activities = ActivitySerializer(many=True, read_only=True)
#     hotels = HotelSerializer(many=True, read_only=True)
#     restaurants = RestaurantSerializer(many=True, read_only=True)
#     places_visited = PlaceVisitedSerializer(many=True, read_only=True)
#     media = MediaSerializer(many=True, read_only=True)
#     image_cover = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

#     class Meta:
#         model = Trip
#         fields = ['id', 'title', 'days', 'nights', 'starting_location', 'cost', 'image_cover', 'best_time_to_visit', 'emergency_numbers', 'currency_used', 'language_spoken', 'number_of_people', 'places_visited', 'hotels', 'activities', 'restaurants', 'media']
#         read_only_fields = ['user']



# from rest_framework import serializers
# from .models import (
#     Trip,
#     Media,
#     PlaceVisited,
#     Activity,
#     Hotel,
#     Restaurant,
#     ModeOfTransport,
# )


# class MediaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Media
#         fields = ['id', 'file', 'media_type', 'caption']





# class PlaceVisitedSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)
   
#     class Meta:
#         model = PlaceVisited
#         fields = ['id', 'name', 'description', 'cost', 'best_time_to_visit', 'safety_tips', 'coordinates', 'media','transport']
#         # fields='__all__'

# class ActivitySerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)

#     class Meta:
#         model = Activity
#         fields = ['id', 'name', 'cost', 'description', 'review', 'media', 'trip']


# class HotelSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)

#     class Meta:
#         model = Hotel
#         fields = ['id', 'name', 'cost', 'description', 'review', 'media', 'rooms_booked', 'trip']


# class RestaurantSerializer(serializers.ModelSerializer):
#     media = MediaSerializer(many=True, read_only=True)

#     class Meta:
#         model = Restaurant
#         fields = ['id', 'name', 'cost', 'description', 'review', 'media', 'things_to_try', 'meal_type', 'trip']


# class ModeOfTransportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ModeOfTransport
#         fields = ['id', 'mode', 'duration_in_hours', 'cost', 'description', 'places_visited']


# class TripSerializer(serializers.ModelSerializer):
    
#     activities = ActivitySerializer(many=True, read_only=True)
#     hotels = HotelSerializer(many=True, read_only=True)
#     restaurants = RestaurantSerializer(many=True, read_only=True)
#     media = MediaSerializer(many=True, read_only=True)
    

#     class Meta:
#         model = Trip
#         fields = [
#             'id',
#             'title',
#             'user',
#             'days',
#             'nights',
#             'starting_location',
#             'cost',
#             'image_cover',
#             'best_time_to_visit',
#             'emergency_numbers',
#             'currency_used',
#             'language_spoken',
#             'number_of_people',

#             'places_visited',
#             'activities',
#             'hotels',
#             'restaurants',
#             'media',
#         ]
#         read_only_fields = ['user']

#     def places_visited(self, obj):
#         """
#         Custom method to fetch all places visited for the trip.
#         This method does not apply any filters and directly returns all related places.
#         """
#         # Fetch all places visited related to the trip
#         places = obj.places_visited.all()

#         # Serialize the places using PlaceVisitedSerializer
#         return PlaceVisitedSerializer(places, many=True).data


from rest_framework import serializers
from .models import (
    Trip,
    Media,
    PlaceVisited,
    Activity,
    Hotel,
    Restaurant,
    ModeOfTransport,
)
import mimetypes

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "file", "media_type", "caption"]
        read_only_fields = ["id"]

    def validate_file(self, value):
        """Ensure the uploaded file matches the media type."""
        mime_type, _ = mimetypes.guess_type(value.name)
        media_type = self.initial_data.get("media_type")

        if media_type == Media.MediaTypeChoices.IMAGE and not mime_type.startswith("image"):
            raise serializers.ValidationError("Uploaded file is not an image.")
        elif media_type == Media.MediaTypeChoices.VIDEO and not mime_type.startswith("video"):
            raise serializers.ValidationError("Uploaded file is not a video.")

        return value


# PlaceVisitedSerializer for serializing places visited
class PlaceVisitedSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True,required=False)
    
    class Meta:
        model = PlaceVisited
        fields = ['id', 'name', 'description', 'cost', 'best_time_to_visit',  'coordinates', 'media', ]

# ActivitySerializer for serializing activities
class ActivitySerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True,required=False)

    class Meta:
        model = Activity
        fields = ['id', 'name', 'cost', 'description','best_time_to_visit','media',  'trip','location']
        
        

# HotelSerializer for serializing hotels
class HotelSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True,required=False)

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'cost', 'description', 'rating', 'media', 'rooms_booked', 'trip','location']

# RestaurantSerializer for serializing restaurants
class RestaurantSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True,required=False)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'cost', 'description', 'rating', 'media', 'meal_type', 'trip','location']

# ModeOfTransportSerializer for serializing transport modes
class ModeOfTransportSerializer(serializers.ModelSerializer):
    places_visited = PlaceVisitedSerializer(many=True, read_only=True)

    class Meta:
        model = ModeOfTransport
        fields = ['id', 'mode', 'duration', 'cost', 'description', 'places_visited']
class TripSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    hotels = HotelSerializer(many=True, read_only=True)
    restaurants = RestaurantSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)
    places_visited = PlaceVisitedSerializer(many=True, read_only=True)


    class Meta:
        model = Trip
        fields = [

            'id',
            'title',
            'user',
            'description',
            'days',
            'nights',
            'starting_location',
            'cost',
            'image_cover',
            'best_time_to_visit',
            'emergency_numbers',
            'location',
            'currency_used',
            'language_spoken',
            'number_of_people',
            'places_visited',  # Ensure this field is included
            'activities',
            'hotels',
            'restaurants',
            'location',
            'media',
            
        ]
        image_cover = serializers.ImageField(required=False, allow_null=True)

        read_only_fields = ['user']

    # Remove custom places_visited method, as this is handled by the serializer directly

    # If you need a custom serializer method or any specific filtering, you can add it here
