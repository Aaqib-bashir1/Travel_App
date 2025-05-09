# Generated by Django 5.1.4 on 2025-01-13 06:49

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PlaceVisited',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='places_visited/')),
                ('coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('description', models.TextField()),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('best_time_to_visit', models.CharField(choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening')], max_length=50, null=True)),
            ],
            options={
                'verbose_name_plural': 'Places Visited',
            },
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to='media_uploads/')),
                ('media_type', models.CharField(choices=[('image', 'Image'), ('video', 'Video')], default='image', max_length=5)),
                ('caption', models.CharField(blank=True, max_length=255, null=True)),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255)),
                ('days', models.PositiveIntegerField(default=0)),
                ('nights', models.PositiveIntegerField(default=0)),
                ('starting_location', models.CharField(max_length=255)),
                ('location', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('image_cover', models.ImageField(upload_to='trips/')),
                ('best_time_to_visit', models.CharField(choices=[('Summer', 'Summer'), ('Winter', 'Winter'), ('Spring', 'Spring'), ('Autumn', 'Autumn')], max_length=100, null=True)),
                ('emergency_numbers', models.CharField(max_length=255)),
                ('currency_used', models.CharField(max_length=255)),
                ('language_spoken', models.CharField(blank=True, max_length=255)),
                ('number_of_people', models.PositiveIntegerField(default=1)),
                ('places_visited', models.ManyToManyField(blank=True, related_name='visited_in_trips', to='trip.placevisited')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trips', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('meal_type', models.CharField(choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Dinner', 'Dinner')], max_length=100)),
                ('coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restaurants', to='trip.trip')),
            ],
        ),
        migrations.AddField(
            model_name='placevisited',
            name='trip',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='trip.trip'),
        ),
        migrations.CreateModel(
            name='ModeOfTransport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mode', models.CharField(choices=[('Car', 'Car'), ('Bus', 'Bus'), ('Train', 'Train'), ('Flight', 'Flight'), ('Walking', 'Walking'), ('Bicycle', 'Bicycle'), ('Boat', 'Boat'), ('Other', 'Other')], max_length=20)),
                ('duration', models.DurationField(blank=True, null=True)),
                ('cost', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('places_visited', models.ManyToManyField(blank=True, related_name='visited_by_transport', to='trip.placevisited')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transport', to='trip.trip')),
            ],
        ),
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rooms_booked', models.PositiveIntegerField()),
                ('coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hotels', to='trip.trip')),
            ],
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.TextField(max_length=255)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='trip.trip')),
            ],
        ),
    ]
