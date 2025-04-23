# from django.urls import path
# from .views import AllTripsAPIView,TripAPIView,FilteredTripsAPIView,  ActivityAPIView, HotelAPIView, RestaurantAPIView 
# urlpatterns = [
#     path('all_trips/',AllTripsAPIView.as_view()),
#     path('trips/filter/', FilteredTripsAPIView.as_view(), name='filtered_trips'),
#     path('my_trips/', TripAPIView.as_view()),
#     path('trips/<int:pk>/', AllTripsAPIView.as_view()),
#     path('trip/<int:pk>/', TripAPIView.as_view()),
   
#     path('activities/', ActivityAPIView.as_view()),
#     path('activities/<int:pk>/', ActivityAPIView.as_view()),
#     path('hotels/', HotelAPIView.as_view()),
#     path('hotels/<int:pk>/', HotelAPIView.as_view()),
#     path('restaurants/', RestaurantAPIView.as_view()),
#     path('restaurants/<int:pk>/', RestaurantAPIView.as_view()),
    
# ]
# from django.urls import path
# from .views import AllTripsAPIView, TripAPIView, FilteredTripsAPIView, ActivityAPIView, HotelAPIView, RestaurantAPIView,PlaceVisitedListAPIView ,PlaceVisitedAPIView

# urlpatterns = [
#     path('all_trips/', AllTripsAPIView.as_view()),
#     path('all_trips/<int:pk>/', AllTripsAPIView.as_view()),  # You might want to update this to use the correct view
    
#     path('trips/filter/', FilteredTripsAPIView.as_view(), name='filtered_trips'),

#     path('my_trips/', TripAPIView.as_view()),
#     path('my_trip/<int:pk>/', TripAPIView.as_view()),
   
    
   
#     path('activities/', ActivityAPIView.as_view()),
#     path('activities/<int:pk>/', ActivityAPIView.as_view()),
#     path('hotels/', HotelAPIView.as_view()),
#     path('hotels/<int:pk>/', HotelAPIView.as_view()),
#     path('restaurants/', RestaurantAPIView.as_view()),
#     path('restaurants/<int:pk>/', RestaurantAPIView.as_view()),

#     # Add the URL pattern for PlaceVisited
#     path('places_visited/', PlaceVisitedAPIView.as_view()), 
#     path('places_visited/<int:pk>/', PlaceVisitedAPIView.as_view()), 
#     path('allplaces_visited/', PlaceVisitedListAPIView.as_view()),
#     path('allplaces_visited/<int:pk>', PlaceVisitedListAPIView.as_view()),
# ]
from django.urls import path
from .views import (
    AllTripsAPIView,
    TripAPIView,
    FilteredTripsAPIView,
    ActivityAPIView,
    HotelAPIView,
    RestaurantAPIView,
    PlaceVisitedListAPIView,
    PlaceVisitedAPIView,
    MediaAPIView
)

urlpatterns = [
    # Public Trips Endpoints
    path('trips/', AllTripsAPIView.as_view(), name='all-trips-list'),  # List all trips (public)
    path('trips/<int:pk>/', AllTripsAPIView.as_view(), name='all-trips-detail'),  # Retrieve a specific trip (public)

    # Filtered Trips Endpoint
    path('trips/filter/', FilteredTripsAPIView.as_view(), name='filtered-trips'),  # Filter trips (public)

    # Authenticated User Trips Endpoints
    path('my-trips/', TripAPIView.as_view(), name='my-trips-list'),  # List trips for authenticated user
    path('my-trips/<int:pk>/', TripAPIView.as_view(), name='my-trips-detail'),  # Retrieve/update/delete a specific trip for authenticated user

    # Activities Endpoints
    path('activities/', ActivityAPIView.as_view(), name='activities-list'),  # List all activities
    path('activities/<int:pk>/', ActivityAPIView.as_view(), name='activities-detail'),  # Retrieve/update/delete a specific activity

    # Hotels Endpoints
    path('hotels/', HotelAPIView.as_view(), name='hotels-list'),  # List all hotels
    path('hotels/<int:pk>/', HotelAPIView.as_view(), name='hotels-detail'),  # Retrieve/update/delete a specific hotel

    # Restaurants Endpoints
    path('restaurants/', RestaurantAPIView.as_view(), name='restaurants-list'),  # List all restaurants
    path('restaurants/<int:pk>/', RestaurantAPIView.as_view(), name='restaurants-detail'),  # Retrieve/update/delete a specific restaurant

    # Place Visited Endpoints (Authenticated)
    path('places-visited/', PlaceVisitedAPIView.as_view(), name='places-visited-list'),  # List all places visited for authenticated user
    path('places-visited/<int:pk>/', PlaceVisitedAPIView.as_view(), name='places-visited-detail'),  # Retrieve/update/delete a specific place visited for authenticated user

    # Public Place Visited Endpoints (Read-Only)
    path('all-places-visited/', PlaceVisitedListAPIView.as_view(), name='all-places-visited-list'),  # List all places visited (public)
    path('all-places-visited/<int:pk>/', PlaceVisitedListAPIView.as_view(), name='all-places-visited-detail'),  # Retrieve a specific place visited (public)

    # Media Endpoints
    path("my-trips/<int:pk>/media/", MediaAPIView.as_view(), name="trip-media"),  # ✅ POST media for a trip
    path('activities/<int:activity_id>/media/', MediaAPIView.as_view(), name='activity-media-upload'),
    # Hotel media
    path('hotels/<int:hotel_id>/media/', MediaAPIView.as_view(), name='hotel-media-upload'),
    # Restaurant media
    path('restaurants/<int:restaurant_id>/media/', MediaAPIView.as_view(), name='restaurant-media-upload'),
    # Places visited media
    path('places-visited/<int:place_id>/media/', MediaAPIView.as_view(), name='placesvisited-media-upload'),
    path("media/<int:media_id>/", MediaAPIView.as_view(), name="media-detail"),  # ✅ PUT & DELETE specific media
]