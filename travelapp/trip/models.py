
# from django.conf import settings 
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType
# from django.contrib.contenttypes.fields import GenericRelation
# from django.contrib.gis.db import models as geomodels
# from django.db import models
# import subprocess
# from PIL import Image

# RATING_CHOICES = [(str(i),i) for i in range(1, 6)]



# class Media(models.Model):
#     MEDIA_TYPE_CHOICES = (
#         ('image', 'Image'),
#         ('video', 'Video'),
#     )

#     file = models.FileField(upload_to='media_upload_to/', blank=True, null=True)
#     media_type = models.CharField(max_length=5, choices=MEDIA_TYPE_CHOICES, default='image')
#     caption = models.CharField(max_length=255, blank=True, null=True)
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
#     object_id = models.PositiveIntegerField()
#     content_object = GenericForeignKey('content_type', 'object_id')

#     def __str__(self):
#         return f"{self.media_type.capitalize()} - {self.caption}"

    

#     def resize_image(self, target_ratio=(16, 9), max_width=800, max_height=800):
#         """Resize image to a fixed aspect ratio (16:9) by cropping or padding."""
#         if not self.file:
#             return None

#         image = Image.open(self.file)
#         width, height = image.size

#         target_width, target_height = target_ratio

#         # Calculate new dimensions based on target ratio
#         new_width = min(max_width, width)
#         new_height = min(max_height, height)

#         target_ratio = target_width / target_height
#         current_ratio = width / height

#         if current_ratio > target_ratio:
#             # Crop horizontally
#             new_width = int(new_height * target_ratio)
#             left = (width - new_width) // 2
#             top = 0
#             right = left + new_width
#             bottom = height
#             image = image.crop((left, top, right, bottom))
#         elif current_ratio < target_ratio:
#             # Crop vertically
#             new_height = int(new_width / target_ratio)
#             left = 0
#             top = (height - new_height) // 2
#             right = width
#             bottom = top + new_height
#             image = image.crop((left, top, right, bottom))
        
#         # Resize image to fit the new dimensions (16:9 aspect ratio)
#         image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

#         # Save the image to the same location with a suffix indicating the aspect ratio
#         resized_filename = f"{self.file.name.split('.')[0]}_16x9.{self.file.name.split('.')[-1]}"
#         image.save(resized_filename)

#         # Update the file path to point to the resized image
#         self.file.name = resized_filename

#         return self.file
    
#     def resize_video(self, aspect_ratio="16:9"):
#         """Resize video to a fixed aspect ratio using ffmpeg."""
#         if not self.file:
#             return None

#         input_path = self.file.path
#         output_path = f"{self.file.path.split('.')[0]}_16x9.{self.file.name.split('.')[-1]}"

#         # FFmpeg command to resize the video to 16:9 aspect ratio (by cropping or padding)
#         command = [
#             'ffmpeg',
#             '-i', input_path,  # Input file
#             '-vf', f"scale=1280:720,setsar=1:1",  # Resize video to 1280x720 resolution (16:9 ratio)
#             '-c:a', 'copy',  # Copy audio stream without re-encoding
#             output_path  # Output file
#         ]
        
#         subprocess.run(command)

#         # Update the file path to the resized video
#         self.file.name = output_path.split('/')[-1]


#     def save(self, *args, **kwargs):
#         """Override save to resize image or video before saving."""
#         if self.media_type == 'image':
#             self.resize_image()  # Resize image to 16:9 aspect ratio before saving
#         elif self.media_type == 'video':
#             self.resize_video()  # Resize video to 16:9 aspect ratio before saving

#         super().save(*args, **kwargs)

# class Trip(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
#     title = models.CharField(max_length=255, blank=True)
#     days = models.IntegerField(default=0)
#     nights = models.IntegerField(default=0)
#     starting_location = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     image_cover = models.ImageField(upload_to='trips/')
#     media = GenericRelation(Media, related_query_name='trip')
#     best_time_to_visit = models.CharField(max_length=100, choices=[('Summer', 'Summer'), ('Winter', 'Winter'), ('Spring', 'Spring'), ('Autumn', 'Autumn')],null=True)
#     emergency_numbers = models.CharField(max_length=255)
#     currency_used= models.CharField(max_length=255)
#     language_spoken = models.CharField(max_length=255, blank=True)
#     number_of_people = models.IntegerField(default=1)
#     places_visited = models.ManyToManyField('PlaceVisited',related_name='place_visited_related', blank=True))

#     def __str__(self):
#         return self.title +" Trip"
    

#     def save(self, *args, **kwargs):
#         if not self.title:
#             self.title = f"Trip by {self.user.userprofile}"
#         super().save(*args, **kwargs)



# class Activity(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     media = GenericRelation(Media, related_query_name='activity')
#     description = models.TextField(max_length=255)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='placevisited_activity', blank=True)
#     review = models.CharField(max_length=100, choices=RATING_CHOICES,null=True)
#     def __str__(self):
#         return self.name
  


# # Hotel model to store hotels stayed during the trip
# class Hotel(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='hotels')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     review = models.CharField(max_length=100, choices=RATING_CHOICES,blank=True,null=True)
#     media = GenericRelation(Media, related_query_name='hotel')
#     coordinates = geomodels.PointField(blank=True, null=True) 
#     description = models.TextField(max_length=255)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='placevisited_hotel', blank=True)
#     rooms_booked=models.IntegerField()
#     def __str__(self):
#         return self.name
   

# # Restaurant model to store restaurants visited during the trip
# class Restaurant(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='restaurants')
#     name = models.CharField(max_length=255)
#     things_to_try = models.TextField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     meal_type = models.CharField(max_length=100, choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Dinner', 'Dinner')])
#     review = models.CharField(max_length=100,choices=RATING_CHOICES,null=True)
#     description = models.TextField(max_length=255)
#     image = models.ImageField(upload_to='Restaurants/', blank=True, null=True)
#     media = GenericRelation(Media, related_query_name='Restaurant')
#     coordinates = geomodels.PointField(blank=True, null=True) 
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='placevisited_restaurant', blank=True)
#     def __str__(self):
#         return self.name
   
# class PlaceVisited(models.Model):
#     name = models.CharField(max_length=255)
#     cover_image = models.ImageField(upload_to='places_visited/', blank=True, null=True)
#     trip = models.ForeignKey('Trip', on_delete=models.CASCADE)
#     activity = models.ForeignKey('Activity', on_delete=models.CASCADE, related_name='placevisited_activity', blank=True, null=True)
#     hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, related_name='placevisited_hotel', blank=True, null=True)
#     restaurant = models.ForeignKey('Restaurant', on_delete=models.CASCADE, related_name='placevisited_restaurant', blank=True, null=True)
#     transport = models.ManyToManyField('ModeOfTransport', related_name='transport_modes', blank=True)
#     coordinates = geomodels.PointField(blank=True, null=True)  # Optional, if you want to store the coordinates
#     route_details = models.TextField(blank=True, null=True)  # Optional, if you want to store a text-based description of the route
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     best_time_to_visit = models.CharField(choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening')], blank=True, null=True)
#     safety_tips = models.TextField(blank=True, null=True)
#     description = models.TextField()
#     media = GenericRelation(Media, related_query_name='placevisited')
#     places_visited = models.ManyToManyField(
#     'PlaceVisited',
#     related_name='place_visited_related',  # Change related name to 'place_visited_related'
#     blank=True
# )

#     class Meta:
#         verbose_name_plural = "Places Visited"
  
# class ModeOfTransport(models.Model):
#     MODE_CHOICES = [
#         ('Car', 'Car'),
#         ('Bus', 'Bus'),
#         ('Train', 'Train'),
#         ('Flight', 'Flight'),
#         ('Walking', 'Walking'),
#         ('Bicycle', 'Bicycle'),
#         ('Boat', 'Boat'),
#         ('Other', 'Other'),  # For any other mode of transport
#     ]
#     duration_in_hours = models.IntegerField(blank=True, null=True) 
#     mode = models.CharField(max_length=20, choices=MODE_CHOICES)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='visited_places', blank=True)
    
#     def __str__(self):
#         description = self.mode
#         if self.duration_in_hours:
#             description += f" - {self.duration_in_hours} hours"
#         if self.cost:
#             description += f" - {self.cost}"
#         return description


# from django.conf import settings 
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType
# from django.contrib.contenttypes.fields import GenericRelation
# from django.contrib.gis.db import models as geomodels
# from django.db import models
# import subprocess
# from PIL import Image

# RATING_CHOICES = [(str(i), i) for i in range(1, 6)]


# class Media(models.Model):
#     MEDIA_TYPE_CHOICES = (
#         ('image', 'Image'),
#         ('video', 'Video'),
#     )

#     file = models.FileField(upload_to='media_upload_to/', blank=True, null=True)
#     media_type = models.CharField(max_length=5, choices=MEDIA_TYPE_CHOICES, default='image')
#     caption = models.CharField(max_length=255, blank=True, null=True)
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
#     object_id = models.PositiveIntegerField()
#     content_object = GenericForeignKey('content_type', 'object_id')

#     def __str__(self):
#         return f"{self.media_type.capitalize()} - {self.caption}"

#     def resize_image(self, target_ratio=(16, 9), max_width=800, max_height=800):
#         if not self.file:
#             return None

#         image = Image.open(self.file)
#         width, height = image.size
#         target_width, target_height = target_ratio
#         new_width = min(max_width, width)
#         new_height = min(max_height, height)

#         target_ratio = target_width / target_height
#         current_ratio = width / height

#         if current_ratio > target_ratio:
#             new_width = int(new_height * target_ratio)
#             left = (width - new_width) // 2
#             top = 0
#             right = left + new_width
#             bottom = height
#             image = image.crop((left, top, right, bottom))
#         elif current_ratio < target_ratio:
#             new_height = int(new_width / target_ratio)
#             left = 0
#             top = (height - new_height) // 2
#             right = width
#             bottom = top + new_height
#             image = image.crop((left, top, right, bottom))

#         image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
#         resized_filename = f"{self.file.name.split('.')[0]}_16x9.{self.file.name.split('.')[-1]}"
#         image.save(resized_filename)
#         self.file.name = resized_filename

#         return self.file

#     def resize_video(self, aspect_ratio="16:9"):
#         if not self.file:
#             return None

#         input_path = self.file.path
#         output_path = f"{self.file.path.split('.')[0]}_16x9.{self.file.name.split('.')[-1]}"

#         command = [
#             'ffmpeg',
#             '-i', input_path,
#             '-vf', f"scale=1280:720,setsar=1:1",
#             '-c:a', 'copy',
#             output_path
#         ]
#         subprocess.run(command)
#         self.file.name = output_path.split('/')[-1]

#     def save(self, *args, **kwargs):
#         if self.media_type == 'image':
#             self.resize_image()
#         elif self.media_type == 'video':
#             self.resize_video()
#         super().save(*args, **kwargs)


# class Trip(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
#     title = models.CharField(max_length=255, blank=True)
#     days = models.IntegerField(default=0)
#     nights = models.IntegerField(default=0)
#     starting_location = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     image_cover = models.ImageField(upload_to='trips/')
#     media = GenericRelation(Media, related_query_name='trip')
#     best_time_to_visit = models.CharField(max_length=100, choices=[('Summer', 'Summer'), ('Winter', 'Winter'), ('Spring', 'Spring'), ('Autumn', 'Autumn')], null=True)
#     emergency_numbers = models.CharField(max_length=255)
#     currency_used = models.CharField(max_length=255)
#     language_spoken = models.CharField(max_length=255, blank=True)
#     number_of_people = models.IntegerField(default=1)
#     transport = models.ManyToManyField('ModeOfTransport', related_name='trip_transport', blank=True)
#     places_visited = models.ManyToManyField('PlaceVisited',related_name="visited_in_trips", blank=True)

#     def __str__(self):
#         return self.title + " Trip"

#     def save(self, *args, **kwargs):
#         if not self.title:
#             self.title = f"Trip by {self.user.userprofile}"
#         super().save(*args, **kwargs)


# class Activity(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     media = GenericRelation(Media, related_query_name='activity')
#     description = models.TextField(max_length=255)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='places_visited_activity', blank=True)
#     review = models.CharField(max_length=100, choices=RATING_CHOICES, null=True)

#     def __str__(self):
#         return self.name


# class Hotel(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='hotels')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     review = models.CharField(max_length=100, choices=RATING_CHOICES, blank=True, null=True)
#     media = GenericRelation(Media, related_query_name='hotel')
#     coordinates = geomodels.PointField(blank=True, null=True)
#     description = models.TextField(max_length=255)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='places_visited_hotel', blank=True)
#     rooms_booked = models.IntegerField()

#     def __str__(self):
#         return self.name


# class Restaurant(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='restaurants')
#     name = models.CharField(max_length=255)
#     things_to_try = models.TextField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     meal_type = models.CharField(max_length=100, choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Dinner', 'Dinner')])
#     review = models.CharField(max_length=100, choices=RATING_CHOICES, null=True)
#     description = models.TextField(max_length=255)
#     image = models.ImageField(upload_to='Restaurants/', blank=True, null=True)
#     media = GenericRelation(Media, related_query_name='Restaurant')
#     coordinates = geomodels.PointField(blank=True, null=True)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='places_visited_restaurant', blank=True)

#     def __str__(self):
#         return self.name


# class PlaceVisited(models.Model):
#     name = models.CharField(max_length=255)
#     cover_image = models.ImageField(upload_to='places_visited/', blank=True, null=True)
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
#     activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='placevisited_activity', blank=True, null=True)
#     hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='placevisited_hotel', blank=True, null=True)
#     restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='placevisited_restaurant', blank=True, null=True)
#     transport = models.ManyToManyField('ModeOfTransport', related_name='place_visited_transport', blank=True)
#     coordinates = geomodels.PointField(blank=True, null=True)
#     route_details = models.TextField(blank=True, null=True)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     best_time_to_visit = models.CharField(choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening')], blank=True, null=True)
#     safety_tips = models.TextField(blank=True, null=True)
#     description = models.TextField()
#     media = GenericRelation(Media, related_query_name='placevisited')

#     class Meta:
#         verbose_name_plural = "Places Visited"
#     def __str__(self):
#         return self.name


# class ModeOfTransport(models.Model):
#     MODE_CHOICES = [
#         ('Car', 'Car'),
#         ('Bus', 'Bus'),
#         ('Train', 'Train'),
#         ('Flight', 'Flight'),
#         ('Walking', 'Walking'),
#         ('Bicycle', 'Bicycle'),
#         ('Boat', 'Boat'),
#         ('Other', 'Other'),
#     ]
#     duration_in_hours = models.IntegerField(blank=True, null=True)
#     mode = models.CharField(max_length=20, choices=MODE_CHOICES)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     places_visited = models.ManyToManyField('PlaceVisited', related_name='visited_places', blank=True)

#     def __str__(self):
#         description = self.mode
#         if self.duration_in_hours:
#             description += f" - {self.duration_in_hours} hours"
#         if self.cost:
#             description += f" - {self.cost}"
#         return description



# from django.conf import settings
# from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
# from django.contrib.contenttypes.models import ContentType
# from django.contrib.gis.db import models as geomodels
# from django.db import models
# from django.db.models import TextChoices
# from django.core.exceptions import ValidationError
# import subprocess
# from PIL import Image
# import mimetypes


# RATING_CHOICES = [(str(i), i) for i in range(1, 6)]


# class Media(models.Model):
#     class MediaTypeChoices(TextChoices):
#         IMAGE = 'image', 'Image'
#         VIDEO = 'video', 'Video'

#     file = models.FileField(upload_to='media_uploads/', blank=True, null=True)
#     media_type = models.CharField(
#         max_length=5, choices=MediaTypeChoices.choices, default=MediaTypeChoices.IMAGE
#     )
#     caption = models.CharField(max_length=255, blank=True, null=True)
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
#     object_id = models.PositiveIntegerField()
#     content_object = GenericForeignKey('content_type', 'object_id')

#     def clean(self):
#         if self.file:
#             mime_type, _ = mimetypes.guess_type(self.file.name)
#             if self.media_type == self.MediaTypeChoices.IMAGE and not mime_type.startswith('image'):
#                 raise ValidationError("File is not an image.")
#             elif self.media_type == self.MediaTypeChoices.VIDEO and not mime_type.startswith('video'):
#                 raise ValidationError("File is not a video.")

#     def resize_image(self, target_ratio=(16, 9), max_width=800, max_height=800):
#         if not self.file:
#             return None

#         image = Image.open(self.file)
#         width, height = image.size
#         target_ratio = target_ratio[0] / target_ratio[1]
#         current_ratio = width / height

#         if current_ratio > target_ratio:
#             new_width = int(height * target_ratio)
#             left = (width - new_width) // 2
#             image = image.crop((left, 0, left + new_width, height))
#         elif current_ratio < target_ratio:
#             new_height = int(width / target_ratio)
#             top = (height - new_height) // 2
#             image = image.crop((0, top, width, top + new_height))

#         image = image.resize((min(max_width, width), min(max_height, height)), Image.Resampling.LANCZOS)
#         self.file.name = f"{self.file.name.rsplit('.', 1)[0]}_resized.{self.file.name.rsplit('.', 1)[-1]}"
#         image.save(self.file.path)

#     def resize_video(self, resolution="1280x720"):
#         if not self.file:
#             return None

#         input_path = self.file.path
#         output_path = f"{self.file.path.rsplit('.', 1)[0]}_resized.{self.file.path.rsplit('.', 1)[-1]}"
#         command = [
#             'ffmpeg', '-i', input_path, '-vf', f"scale={resolution},setsar=1:1", '-c:a', 'copy', output_path
#         ]
#         result = subprocess.run(command, capture_output=True)
#         if result.returncode == 0:
#             self.file.name = output_path.split('/')[-1]
#         else:
#             print(f"Error resizing video: {result.stderr.decode()}")

#     def save(self, *args, **kwargs):
#         if self.media_type == self.MediaTypeChoices.IMAGE:
#             self.resize_image()
#         elif self.media_type == self.MediaTypeChoices.VIDEO:
#             self.resize_video()
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.media_type.capitalize()} - {self.caption or 'Untitled'}"


# class Trip(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
#     title = models.CharField(max_length=255, blank=True)
#     days = models.PositiveIntegerField(default=0)
#     nights = models.PositiveIntegerField(default=0)
#     starting_location = models.CharField(max_length=255)
#     location = geomodels.PointField(blank=True, null=True)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     image_cover = models.ImageField(upload_to='trips/')
#     media = GenericRelation(Media, related_query_name='trip')
#     best_time_to_visit = models.CharField(
#         max_length=100, choices=[('Summer', 'Summer'), ('Winter', 'Winter'), ('Spring', 'Spring'), ('Autumn', 'Autumn')],
#         null=True
#     )
#     emergency_numbers = models.CharField(max_length=255)
#     currency_used = models.CharField(max_length=255)
#     language_spoken = models.CharField(max_length=255, blank=True)
#     number_of_people = models.PositiveIntegerField(default=1)
   

#     def __str__(self):
#         return self.title or f"Trip by {self.user.username}"

#     def total_cost(self):
#         activities_cost = sum(activity.cost for activity in self.activities.all())
#         hotels_cost = sum(hotel.cost for hotel in self.hotels.all())
#         restaurants_cost = sum(restaurant.cost for restaurant in self.restaurants.all())
#         transport_cost = sum(transport.cost or 0 for transport in self.transport.all())
#         return self.cost + activities_cost + hotels_cost + restaurants_cost + transport_cost


# class PlaceVisited(models.Model):
#     name = models.CharField(max_length=255)
#     cover_image = models.ImageField(upload_to='places_visited/', blank=True, null=True)
#     trip = models.ForeignKey(Trip, related_name='places_visited', on_delete=models.CASCADE)
#     coordinates = geomodels.PointField(blank=True, null=True)
#     description = models.TextField()
#     cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     best_time_to_visit = models.CharField(
#         max_length=50, choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening')], null=True
#     )
#     media = GenericRelation(Media, related_query_name='placevisited')

#     class Meta:
#         verbose_name_plural = "Places Visited"

#     def __str__(self):
#         return self.name


# class ModeOfTransport(models.Model):
#     class ModeChoices(TextChoices):
#         CAR = 'Car', 'Car'
#         BUS = 'Bus', 'Bus'
#         TRAIN = 'Train', 'Train'
#         FLIGHT = 'Flight', 'Flight'
#         WALKING = 'Walking', 'Walking'
#         BICYCLE = 'Bicycle', 'Bicycle'
#         BOAT = 'Boat', 'Boat'
#         OTHER = 'Other', 'Other'

#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='transport')
#     mode = models.CharField(max_length=20, choices=ModeChoices.choices)
#     duration = models.DurationField(blank=True, null=True)
#     cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     places_visited = models.ManyToManyField(PlaceVisited, related_name='visited_by_transport', blank=True)
#     media = GenericRelation(Media, related_query_name='transport')

#     def __str__(self):
#         return f"{self.mode} ({self.duration or 'N/A'})"


# class Activity(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     description = models.TextField(max_length=255)
#     media = GenericRelation(Media, related_query_name='activity')

#     def __str__(self):
#         return self.name


# class Hotel(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='hotels')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     rooms_booked = models.PositiveIntegerField()
#     coordinates = geomodels.PointField(blank=True, null=True)
#     media = GenericRelation(Media, related_query_name='hotel')

#     def __str__(self):
#         return self.name


# class Restaurant(models.Model):
#     trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='restaurants')
#     name = models.CharField(max_length=255)
#     cost = models.DecimalField(max_digits=10, decimal_places=2)
#     meal_type = models.CharField(
#         max_length=100, choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Dinner', 'Dinner')]
#     )
#     coordinates = geomodels.PointField(blank=True, null=True)
#     media = GenericRelation(Media, related_query_name='restaurant')

#     def __str__(self):
#         return self.name


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
    best_time_to_visit = models.CharField(
        max_length=50, choices=BestTimeToVisitChoices.choices, null=True, verbose_name="Best Time to Visit"
    )
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
    
    best_time_to_visit = models.CharField(
        max_length=50, choices=BestTimeToVisitChoices.choices, null=True, verbose_name="Best Time to Visit"
    )
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
    meal_type = models.CharField(max_length=100, choices=MealTypeChoices.choices, verbose_name="Meal Type")
    location=geomodels.PointField(blank=True, null=True, verbose_name="Location")
    media = GenericRelation(Media, related_query_name='restaurant')
    rating=models.CharField(max_length=100, choices=RATING_CHOICES,blank=True,null=True)
    description=models.TextField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Restaurant"
        verbose_name_plural = "Restaurants"

