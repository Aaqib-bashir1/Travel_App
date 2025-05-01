from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Trip, Activity, Hotel, Restaurant, PlaceVisited,Media
from django.views.generic import TemplateView
from .serializers import (
    TripSerializer,
    ActivitySerializer,
    HotelSerializer,
    RestaurantSerializer,
    PlaceVisitedSerializer,
    MediaSerializer
)
from .filters import TripFilter
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework import status
from django.conf import settings
import os
import logging
logger = logging.getLogger(__name__)

# Reusable caching decorator
def apply_caching(view_func, timeout=15):
    return method_decorator(cache_page(60 * timeout))(view_func)

# Base API View for CRUD operations
class BaseAPIView(APIView):
    model = None
    serializer_class = None
    permission_classes = [IsAuthenticated]
    cache_timeout = 15  # Default cache timeout in minutes

    
    def get(self, request, pk=None):
        if pk:
            instance = get_object_or_404(self.model, pk=pk)
            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        queryset = self.model.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors,type(serializer.errors))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        instance = get_object_or_404(self.model, pk=pk)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = get_object_or_404(self.model, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# All Trips API View (Public)
class AllTripsAPIView(APIView):
    permission_classes = [AllowAny]
    cache_timeout = 15  # Cache timeout in minutes

    
    def get(self, request, pk=None):
        if pk:
            trip = get_object_or_404(Trip, pk=pk)
            serializer = TripSerializer(trip)
            return Response(serializer.data)
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)
    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

# Filtered Trips API View
class FilteredTripsAPIView(APIView):
    permission_classes = [AllowAny]
    cache_timeout = 15

    @apply_caching
    def get(self, request):
        trip_filter = TripFilter(request.query_params, queryset=Trip.objects.all())
        trips = trip_filter.qs
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


# Trip API View (Authenticated)
class TripAPIView(BaseAPIView):
    model = Trip
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    @apply_caching
    def get(self, request, pk=None):
        if pk:
            trip = get_object_or_404(self.model, pk=pk, user=request.user)
            serializer = self.serializer_class(trip)
            return Response(serializer.data)
        queryset = self.model.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Activity API View
class ActivityAPIView(BaseAPIView):
    model = Activity
    serializer_class = ActivitySerializer
    def post(self, request):
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors,type(serializer.errors))
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Hotel API View
class HotelAPIView(BaseAPIView):
    model = Hotel
    serializer_class = HotelSerializer

    
# Restaurant API View
class RestaurantAPIView(BaseAPIView):
    model = Restaurant
    serializer_class = RestaurantSerializer


# Place Visited API View
class PlaceVisitedAPIView(BaseAPIView):
    model = PlaceVisited
    serializer_class = PlaceVisitedSerializer


# Public Place Visited List API View (Read-Only)
class PlaceVisitedListAPIView(APIView):
    permission_classes = [AllowAny]
    cache_timeout = 15

    @apply_caching
    def get(self, request, pk=None):
        if pk:
            place_visited = get_object_or_404(PlaceVisited, pk=pk)
            serializer = PlaceVisitedSerializer(place_visited)
            return Response(serializer.data)
        places_visited = PlaceVisited.objects.all()
        serializer = PlaceVisitedSerializer(places_visited, many=True)
        return Response(serializer.data)




# class MediaAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]  # Allows handling file uploads
#     def get(self, request, media_id):
#         """Retrieve a specific media file."""
#         media = get_object_or_404(Media, id=media_id)
#         serializer = MediaSerializer(media)
#         return Response(serializer.data)

#     def post(self, request, **kwargs):
#     # Determine what kind of content this media is for
#         if 'trip_id' in kwargs:
#             obj = get_object_or_404(Trip, id=kwargs['trip_id'])
#         elif 'activity_id' in kwargs:
#             obj = get_object_or_404(Activity, id=kwargs['activity_id'])
#         elif 'hotel_id' in kwargs:
#             obj = get_object_or_404(Hotel, id=kwargs['hotel_id'])
#         elif 'restaurant_id' in kwargs:
#             obj = get_object_or_404(Restaurant, id=kwargs['restaurant_id'])
#         elif 'place_id' in kwargs:
#             obj = get_object_or_404(PlaceVisited, id=kwargs['place_id'])
#         else:
#             return Response({'error': 'No valid content ID provided'}, status=400)

#         serializer = MediaSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(content_object=obj)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#     def put(self, request, media_id):
#         """Update an existing media file (change caption or replace file)."""
#         media = get_object_or_404(Media, id=media_id)

#         # Handle file replacement
#         if "file" in request.data:
#             # Delete old file
#             if media.file:
#                 old_file_path = os.path.join(settings.MEDIA_ROOT, str(media.file))
#                 if os.path.exists(old_file_path):
#                     os.remove(old_file_path)

#         serializer = MediaSerializer(media, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, media_id):
#         """Delete a media file."""
#         media = get_object_or_404(Media, id=media_id)

#         # Remove file from storage
#         if media.file:
#             file_path = os.path.join(settings.MEDIA_ROOT, str(media.file))
#             if os.path.exists(file_path):
#                 os.remove(file_path)

#         media.delete()
#         return Response({"message": "Media file deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



class MediaAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # To handle file uploads

    def get(self, request, media_id):
        logger.debug("GET request for media id: %s", media_id)
        media = get_object_or_404(Media, id=media_id)
        serializer = MediaSerializer(media)
        return Response(serializer.data)

    def post(self, request, **kwargs):
        logger.debug("POST request received.")
        logger.debug("URL kwargs: %s", kwargs)
        logger.debug("Request data keys: %s", list(request.data.keys()))
        
        # Determine which content object to link with.
        if 'trip_id' in kwargs:
            obj = get_object_or_404(Trip, id=kwargs['trip_id'])
            logger.debug("Found Trip with id: %s", kwargs['trip_id'])
        elif 'activity_id' in kwargs:
            obj = get_object_or_404(Activity, id=kwargs['activity_id'])
            logger.debug("Found Activity with id: %s", kwargs['activity_id'])
        elif 'hotel_id' in kwargs:
            obj = get_object_or_404(Hotel, id=kwargs['hotel_id'])
            logger.debug("Found Hotel with id: %s", kwargs['hotel_id'])
        elif 'restaurant_id' in kwargs:
            obj = get_object_or_404(Restaurant, id=kwargs['restaurant_id'])
            logger.debug("Found Restaurant with id: %s", kwargs['restaurant_id'])
        elif 'place_id' in kwargs:
            obj = get_object_or_404(PlaceVisited, id=kwargs['place_id'])
            logger.debug("Found PlaceVisited with id: %s", kwargs['place_id'])
        else:
            logger.error("No valid content ID provided in kwargs: %s", kwargs)
            return Response({'error': 'No valid content ID provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Log the complete request data for debugging.
        for key, value in request.data.items():
            logger.debug("Request.data[%s] = %s", key, value)

        serializer = MediaSerializer(data=request.data)
        if serializer.is_valid():
            logger.debug("Serializer is valid. Saving media with content_object: %s", obj)
            serializer.save(content_object=obj)
            logger.info("Media saved successfully: %s", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error("Serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, media_id):
        logger.debug("PUT request for media id: %s", media_id)
        logger.debug("Request data keys: %s", list(request.data.keys()))
        media = get_object_or_404(Media, id=media_id)

        if "file" in request.data:
            logger.debug("File replacement requested in PUT.")
            if media.file:
                old_file_path = os.path.join(settings.MEDIA_ROOT, str(media.file))
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
                    logger.debug("Old file removed from disk: %s", old_file_path)
                else:
                    logger.warning("Old file not found at: %s", old_file_path)
            else:
                logger.debug("No existing file found for media id: %s", media_id)

        serializer = MediaSerializer(media, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info("Media updated successfully: %s", serializer.data)
            return Response(serializer.data)
        else:
            logger.error("Serializer errors in PUT: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, media_id):
        logger.debug("DELETE request for media id: %s", media_id)
        media = get_object_or_404(Media, id=media_id)
        if media.file:
            file_path = os.path.join(settings.MEDIA_ROOT, str(media.file))
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.debug("Deleted file from storage: %s", file_path)
            else:
                logger.warning("File not found during DELETE: %s", file_path)
        media.delete()
        logger.info("Media deleted successfully, id: %s", media_id)
        return Response({"message": "Media file deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


