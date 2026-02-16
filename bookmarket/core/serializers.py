from rest_framework import serializers
from .models import SupportTicket, Transaction, User, Book, Order, Notification, Category
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator

# core/serializers.py

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Added 'id' and 'password' for admin/registration purposes
        fields = ['id', 'username', 'password', 'email', 'phone_number', 'first_name', 'last_name', 'role']
        
        # In a standard profile view, username and role are usually fixed
        # But for the Admin ViewSet, they need to be editable.
        # We will handle the restriction in the Profile View instead.
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        buyer = serializers.ReadOnlyField(source='buyer.username')
        book = serializers.ReadOnlyField(source='book.name')
        fields = ['id', 'book','buyer' ,'status', 'created_at'] 
        read_only_fields = ['buyer', 'status']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    seller_name = serializers.ReadOnlyField(source='seller.username')
    seller_contact = serializers.ReadOnlyField(source='seller.phone_number')
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'category', 'category_name', 
            'price', 'condition', 'description', 'image', 
            'seller', 'seller_name', 'seller_contact', 'is_approved','status', 'created_at'
        ]
        read_only_fields = ['is_approved', 'seller']

class RegisterSerializer(serializers.ModelSerializer):
    # Password must be write-only
    password = serializers.CharField(write_only=True)

    # 1. Check Email format and uniqueness
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists.")]
    )

    # 2. Check Phone Number format (Iranian Regex) and uniqueness
    phone_regex = RegexValidator(
        regex=r'^09\d{9}$',
        message="Phone number must start with '09' and be exactly 11 digits."
    )
    phone_number = serializers.CharField(
        validators=[phone_regex, UniqueValidator(queryset=User.objects.all(), message="This phone number is already in use.")],
        required=True
    )

    class Meta:
        model = User
        # Added 'role' so the user can choose during registration
        fields = ('username', 'password', 'email', 'phone_number')

    def create(self, validated_data):
        # Create user using the role provided in the request
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            phone_number=validated_data.get('phone_number', ''),
            role='buyer'
        )
        return user
from django.db import models
from django.db.models import Q
class PasswordResetRequestSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    contact = serializers.CharField(required=True, help_text="Enter your Email or Phone Number")

    def validate(self, data):
        username = data.get('username')
        contact = data.get('contact')

        # چک کردن اینکه آیا کاربری با این یوزنیم و (ایمیل یا تلفن) وجود دارد
        user = User.objects.filter(username=username).filter(
            models.Q(email=contact) | models.Q(phone_number=contact)
        ).first()

        if not user:
            raise serializers.ValidationError("No user found with this username and contact information.")
        
        # یوزر پیدا شده را به داده‌های معتبر اضافه می‌کنیم تا در View از آن استفاده کنیم
        data['user'] = user
        return data

class PasswordResetConfirmSerializer(serializers.Serializer):
    contact = serializers.CharField(required=True)
    code = serializers.CharField(max_length=6, required=True)
    new_password = serializers.CharField(min_length=8, write_only=True, required=True)

# from rest_framework import serializers
# from .models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'phone_number', 'role', 'first_name', 'last_name']
#         read_only_fields = ['role', 'username'] # نقش و نام کاربری معمولاً نباید توسط کاربر تغییر کنند

from rest_framework import serializers
from .models import Order, Book

class OrderHistorySerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.title')
    price = serializers.ReadOnlyField(source='book.price')

    class Meta:
        model = Order
        fields = ['id', 'book_title', 'price', 'status', 'created_at']

from .models import Favorite 
class FavoriteSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'book', 'book_details', 'created_at']
        read_only_fields = ['user'] # کاربر نباید بتواند دستی آیدی خودش را بفرستد

class InvoiceSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    payment_status = serializers.CharField(source='transaction.status', read_only=True)
    tracking_code = serializers.CharField(source='transaction.ref_id', read_only=True)
    total_price = serializers.CharField(source='transaction.amount', read_only=True)
    class Meta:
        model = Order
        fields = [
            'id', 'book_title', 'buyer_name', 
            'total_price', 'status', 'payment_status', 
            'tracking_code', 'created_at'
        ]

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'order', 'amount', 'ref_id', 'status', 'created_at']

# core/serializers.py

# core/views.py

# core/serializers.py

class SupportTicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'user', 'subject', 'message', 'admin_reply', 'is_resolved', 'created_at']

    def __init__(self, *args, **kwargs):
        super(SupportTicketSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        
        if request and request.user.is_staff:
            # For Admin: Message and Subject become Read-only (cannot be in the form)
            # ادمین فقط می‌تواند ببیند، نمی‌تواند در فرم تغییری ایجاد کند
            self.fields['message'].read_only = True
            self.fields['subject'].read_only = True
            self.fields['user'].read_only = True
        elif request:
            # For Regular User: Admin reply is completely hidden or read-only
            # کاربر معمولی اصلاً نباید فیلد پاسخ را در فرم ارسال ببیند
            self.fields['admin_reply'].read_only = True
            self.fields['is_resolved'].read_only = True