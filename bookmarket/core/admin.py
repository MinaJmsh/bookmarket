from django.contrib import admin
from .models import SupportTicket, User, Book, Order, Notification, Category # اضافه کردن Category به ایمپورت‌ها

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'condition', 'seller', 'is_approved')
    list_filter = ('condition', 'is_approved', 'category')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('book', 'buyer', 'status', 'created_at')
    list_filter = ('status', )

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    """
    Configuration for Support Tickets in Admin Panel.
    Restricts editing of user messages.
    """
    # Fields that admin can see but not edit
    readonly_fields = ('user', 'subject', 'message', 'created_at')
    
    # Fields organized in the admin form
    fields = ('user', 'subject', 'message', 'admin_reply', 'is_resolved', 'created_at')
    
    list_display = ('subject', 'user', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'subject')