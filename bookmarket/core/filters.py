from django_filters import rest_framework as filters
from .models import Book

class BookFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')

    class Meta:
        model = Book
        fields = ['category', 'condition', 'is_approved']
