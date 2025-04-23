
# from django.contrib import admin
# from .models import Trip,  Activity, Hotel, Restaurant, Media
# from django.utils.html import format_html
# from django.contrib.contenttypes.admin import GenericStackedInline
# from leaflet.admin import LeafletGeoAdmin

# from django.utils.safestring import mark_safe

# # Media Inline for media uploads
# class MediaInline(GenericStackedInline):
#     model = Media
#     extra = 1
#     fields = ['file', 'media_type', 'caption']

# # Admin for Trip model
# class TripAdmin(LeafletGeoAdmin):
#     list_display = ['title', 'image_cover', 'start_date', 'end_date']
#     search_fields = ['title']
#     inlines = [MediaInline]  # Include media inline for media upload

#     def image_cover_preview(self, obj):
#         if obj.image_cover:
#             return format_html('<img src="{}" width="100" />', obj.image_cover.url)
#         return "No Image"
#     image_cover_preview.short_description = "Image Preview"

# # Admin for Activity model
# class ActivityAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'image']
#     search_fields = ['name']
#     inlines = [MediaInline]

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html('<img src="{}" width="100" />', obj.image.url)
#         return "No Image"
#     image_preview.short_description = "Image Preview"

# # Admin for Hotel model
# class HotelAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'image']
#     search_fields = ['name']
#     inlines = [MediaInline]

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html('<img src="{}" width="100" />', obj.image.url)
#         return "No Image"
#     image_preview.short_description = "Image Preview"

# # Admin for Restaurant model
# class RestaurantAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'image']
#     search_fields = ['name']
#     inlines = [MediaInline]

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html('<img src="{}" width="100" />', obj.image.url)
#         return "No Image"
#     image_preview.short_description = "Image Preview"

# admin.site.register(Trip, TripAdmin)
# admin.site.register(Activity, ActivityAdmin)
# admin.site.register(Hotel, HotelAdmin)
# admin.site.register(Restaurant, RestaurantAdmin)



# from django.contrib import admin
# from .models import Trip, Activity, Hotel, Restaurant, Media, PlaceVisited,ModeOfTransport
# from django.utils.html import format_html
# from django.contrib.contenttypes.admin import GenericStackedInline
# from leaflet.admin import LeafletGeoAdmin
# from django.utils.safestring import mark_safe

# # Media Inline for media uploads
# class MediaInline(GenericStackedInline):
#     model = Media
#     extra = 1
#     fields = ['file', 'media_type', 'caption']

# # Admin for Trip model
# class TripAdmin(LeafletGeoAdmin):
#     list_display = ['title','days', 'nights', 'starting_location', 'cost']
#     search_fields = ['title', 'starting_location', 'user__username']
#     inlines = [MediaInline]  # Include media inline for media upload
#     list_filter = ['best_time_to_visit', 'currency_used', 'language_spoken']
    
    

# # Admin for Activity model
# class ActivityAdmin(LeafletGeoAdmin):
#     list_display = ['name','cost', 'review']
#     search_fields = ['name', 'description']
#     inlines = [MediaInline]

   

# # Admin for Hotel model
# class HotelAdmin(LeafletGeoAdmin):
#     list_display = ['name','cost', 'review', 'coordinates']
#     search_fields = ['name', 'description']
#     inlines = [MediaInline]
#     list_filter = ['places_visited']

   
# # Admin for Restaurant model
# class RestaurantAdmin(LeafletGeoAdmin):
#     list_display = ['name',  'cost', 'meal_type', 'coordinates']
#     search_fields = ['name', 'things_to_try', 'meal_type']
#     inlines = [MediaInline]
#     list_filter = ['places_visited']

   
# # Admin for PlaceVisited model
# class PlaceVisitedAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'trip', 'activity', 'hotel', 'restaurant', 'cost', 'best_time_to_visit', 'coordinates']
#     search_fields = ['name', 'description']
#     list_filter = ['best_time_to_visit', 'activity', 'hotel', 'restaurant']
    
#     # def get_transport_modes(self, obj):
#     #     return ", ".join([mode.mode for mode in obj.transport_modes.all()])
#     # get_transport_modes.short_description = 'Transport Modes'
# # Registering the models with the admin site
# admin.site.register(Trip, TripAdmin)
# admin.site.register(Activity, ActivityAdmin)
# admin.site.register(Hotel, HotelAdmin)
# admin.site.register(Restaurant, RestaurantAdmin)
# admin.site.register(PlaceVisited, PlaceVisitedAdmin)
# admin.site.register(ModeOfTransport)




# from django.contrib import admin
# from .models import Trip, Activity, Hotel, Restaurant, Media, PlaceVisited, ModeOfTransport
# from django.contrib.contenttypes.admin import GenericStackedInline
# from leaflet.admin import LeafletGeoAdmin
# from django.utils.safestring import mark_safe

# # Media Inline for media uploads
# class MediaInline(GenericStackedInline):
#     model = Media
#     extra = 1
#     fields = ['file', 'media_type', 'caption']

# # Admin for Trip model
# class TripAdmin(LeafletGeoAdmin):
#     list_display = ['title', 'days', 'nights', 'starting_location', 'cost']
#     search_fields = ['title', 'starting_location', 'user__username']
#     inlines = [MediaInline]  # Include media inline for media upload
#     list_filter = ['best_time_to_visit', 'currency_used', ]

# # Admin for Activity model
# class ActivityAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'cost', 'review']
#     search_fields = ['name', 'description']
#     inlines = [MediaInline]

# # Admin for Hotel model
# class HotelAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'cost', 'review', 'coordinates']
#     search_fields = ['name', 'description']
#     inlines = [MediaInline]
#     # Removed 'places_visited' from list_filter, you could use 'trip' if needed
#     list_filter = ['trip']

# # Admin for Restaurant model
# class RestaurantAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'cost', 'meal_type', 'coordinates']
#     search_fields = ['name', 'things_to_try', 'meal_type']
#     inlines = [MediaInline]
#     # Removed 'places_visited' from list_filter, you could use 'trip' if needed
#     list_filter = ['trip']

# # Admin for PlaceVisited model
# class PlaceVisitedAdmin(LeafletGeoAdmin):
#     list_display = ['name', 'trip', 'get_activities', 'get_hotels', 'get_restaurants', 'cost', 'best_time_to_visit', 'coordinates']
#     search_fields = ['name', 'description']
#     # Use 'trip' for filtering, not the methods
#     list_filter = ['best_time_to_visit', 'trip']

#     # Custom methods to display related objects
#     def get_activities(self, obj):
#         return ", ".join([activity.name for activity in obj.trip.activities.all()])
#     get_activities.short_description = 'Activities'

#     def get_hotels(self, obj):
#         return ", ".join([hotel.name for hotel in obj.trip.hotels.all()])
#     get_hotels.short_description = 'Hotels'

#     def get_restaurants(self, obj):
#         return ", ".join([restaurant.name for restaurant in obj.trip.restaurants.all()])
#     get_restaurants.short_description = 'Restaurants'

#     # Custom method to display transport modes (optional)
#     def get_transport_modes(self, obj):
#         return ", ".join([mode.mode for mode in obj.transport.all()])
#     get_transport_modes.short_description = 'Transport Modes'

# # Registering the models with the admin site
# admin.site.register(Trip, TripAdmin)
# admin.site.register(Activity, ActivityAdmin)
# admin.site.register(Hotel, HotelAdmin)
# admin.site.register(Restaurant, RestaurantAdmin)
# admin.site.register(PlaceVisited, PlaceVisitedAdmin)
# admin.site.register(ModeOfTransport)
# # admin.site.register(Location)


from django.contrib import admin
from .models import Trip, Activity, Hotel, Restaurant, Media, PlaceVisited, ModeOfTransport
from django.contrib.contenttypes.admin import GenericStackedInline
from leaflet.admin import LeafletGeoAdmin
from django.utils.safestring import mark_safe

# Media Inline for media uploads
class MediaInline(GenericStackedInline):
    model = Media
    extra = 1
    fields = ['file', 'media_type', 'caption']

# Admin for Trip model
class TripAdmin(LeafletGeoAdmin):
    list_display = ['title', 'days', 'nights', 'starting_location', 'cost', 'best_time_to_visit']
    search_fields = ['title', 'starting_location', 'user__username']
    inlines = [MediaInline]  # Include media inline for media upload
    list_filter = ['best_time_to_visit', 'currency_used', 'user', 'places_visited']

    # Custom method to display transport modes
    def get_transport_modes(self, obj):
        return ", ".join([mode.mode for mode in obj.transport.all()])
    get_transport_modes.short_description = 'Transport Modes'

# Admin for Activity model
class ActivityAdmin(LeafletGeoAdmin):
    list_display = ['name', 'cost', 'trip', 'get_media']
    search_fields = ['name', 'description']
    inlines = [MediaInline]

    def get_media(self, obj):
        media_files = obj.media.all()
        return mark_safe("<br>".join([f'<a href="{media.file.url}" target="_blank">{media.caption}</a>' for media in media_files]))
    get_media.short_description = 'Media'

# Admin for Hotel model
class HotelAdmin(LeafletGeoAdmin):
    list_display = ['name', 'cost', 'rooms_booked', 'location', 'get_media']
    search_fields = ['name', 'description']
    inlines = [MediaInline]
    list_filter = ['trip']

    def get_media(self, obj):
        media_files = obj.media.all()
        return mark_safe("<br>".join([f'<a href="{media.file.url}" target="_blank">{media.caption}</a>' for media in media_files]))
    get_media.short_description = 'Media'

# Admin for Restaurant model
class RestaurantAdmin(LeafletGeoAdmin):
    list_display = ['name', 'cost', 'meal_type', 'location', 'get_media']
    search_fields = ['name', 'things_to_try', 'meal_type']
    inlines = [MediaInline]
    list_filter = ['trip']

    def get_media(self, obj):
        media_files = obj.media.all()
        return mark_safe("<br>".join([f'<a href="{media.file.url}" target="_blank">{media.caption}</a>' for media in media_files]))
    get_media.short_description = 'Media'

# Admin for PlaceVisited model
class PlaceVisitedAdmin(LeafletGeoAdmin):
    list_display = ['name', 'trip', 'get_activities', 'get_hotels', 'get_restaurants', 'cost', 'best_time_to_visit', 'coordinates', 'get_media']
    search_fields = ['name', 'description']
    list_filter = ['best_time_to_visit', 'trip']
    inlines = [MediaInline] 

    # Custom methods to display related objects
    def get_activities(self, obj):
        return ", ".join([activity.name for activity in obj.trip.activities.all()])
    get_activities.short_description = 'Activities'

    def get_hotels(self, obj):
        return ", ".join([hotel.name for hotel in obj.trip.hotels.all()])
    get_hotels.short_description = 'Hotels'

    def get_restaurants(self, obj):
        return ", ".join([restaurant.name for restaurant in obj.trip.restaurants.all()])
    get_restaurants.short_description = 'Restaurants'

    def get_media(self, obj):
        media_files = obj.media.all()
        return mark_safe("<br>".join([f'<a href="{media.file.url}" target="_blank">{media.caption}</a>' for media in media_files]))
    get_media.short_description = 'Media'

# Admin for ModeOfTransport model
class ModeOfTransportAdmin(admin.ModelAdmin):
    list_display = ['trip', 'mode', 'duration', 'cost', 'get_media']
    list_filter = ['trip', 'mode']
    search_fields = ['trip__title', 'mode']
    inlines = [MediaInline]

    def get_media(self, obj):
        media_files = obj.media.all()
        return mark_safe("<br>".join([f'<a href="{media.file.url}" target="_blank">{media.caption}</a>' for media in media_files]))
    get_media.short_description = 'Media'

# Registering the models with the admin site
admin.site.register(Trip, TripAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Hotel, HotelAdmin)
admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(PlaceVisited, PlaceVisitedAdmin)
admin.site.register(ModeOfTransport, ModeOfTransportAdmin)
