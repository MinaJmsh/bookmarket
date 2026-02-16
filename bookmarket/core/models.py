from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
class User(AbstractUser):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )
    phone_regex = RegexValidator(
        regex=r'^09\d{9}$',
        message="Phone number must start with '09' and be exactly 11 digits."
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=15, 
        blank=True, 
        null=True
    )

    groups = models.ManyToManyField(Group, related_name='custom_users', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_users_permissions', blank=True)
    reset_code = models.CharField(max_length=10, blank=True, null=True)
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    CONDITION_CHOICES = (('new', 'New'), ('used', 'Used'))
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('pending', 'Pending Review'),
    ]
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    description = models.TextField()
    image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    is_approved = models.BooleanField(default=False) # برای تایید ادمین
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    is_approved = models.BooleanField(default=False)
    def __str__(self):return f"{self.title} - {self.status}"
    def save(self, *args, **kwargs):
        # Logic: If approved and still pending, move to available
        if self.is_approved and self.status == 'pending':
            self.status = 'available'
        
        # Logic: If admin unapproves it later, move it back to pending
        elif not self.is_approved and self.status == 'available':
            self.status = 'pending'
            
        super().save(*args, **kwargs)
class Order(models.Model):
    STATUS_CHOICES = (('pending', 'Pending'), ('paid', 'Paid'), ('shipped', 'Shipped'))
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book') # جلوگیری از افزودن تکراری


class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='transaction')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    ref_id = models.CharField(max_length=100, blank=True, null=True) # Tracking Code
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TX-{self.id} - {self.status}"
    
class SupportTicket(models.Model):
    # Subject choices for better organization
    SUBJECT_CHOICES = [
        ('technical', 'Technical Issue'),
        ('payment', 'Payment Problem'),
        ('report', 'Report User/Book'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    # Admin's response
    admin_reply = models.TextField(blank=True, null=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.user.username}"