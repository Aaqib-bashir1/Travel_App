# Generated by Django 5.1.4 on 2025-02-17 19:04

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trip', '0010_remove_activity_location_remove_hotel_location_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activity',
            name='coordinates',
        ),
        migrations.RemoveField(
            model_name='hotel',
            name='coordinates',
        ),
        migrations.RemoveField(
            model_name='restaurant',
            name='coordinates',
        ),
        migrations.AddField(
            model_name='activity',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326, verbose_name='Location'),
        ),
        migrations.AddField(
            model_name='hotel',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326, verbose_name='Location'),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326, verbose_name='Location'),
        ),
    ]
