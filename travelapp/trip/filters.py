import django_filters
from django.db.models import Q
from .models import Trip

class TripFilter(django_filters.FilterSet):
    # Custom search field to filter by title or ending_location
    search = django_filters.CharFilter(method='filter_by_search', label='Search by title or location')
    
    class Meta:
        model = Trip
        fields = ['search']  # We're only exposing the 'search' field for filtering

    def filter_by_search(self, queryset, name, value):
        """
        Custom filter method to search for both title or ending_location using OR logic.
        """
        return queryset.filter(
            Q(title__icontains=value) | Q(location__icontains=value)
        )
