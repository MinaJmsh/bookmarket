from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, permissions, filters
from .models import Favorite, SupportTicket, Transaction, User, Book, Order, Notification,Category
from .serializers import FavoriteSerializer, InvoiceSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer, SupportTicketSerializer, TransactionSerializer, UserSerializer, BookSerializer, OrderSerializer, NotificationSerializer,CategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsOwnerOrReadOnly, IsSellerOrAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.db.models import Q
import random
import uuid
from rest_framework.decorators import action
# core/views.py

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admin to manage users.
    Includes listing, creating, updating, and deleting users.
    """
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    # Only staff members can access this viewset
    permission_classes = [permissions.IsAdminUser]

    # Adding search capability for the admin dashboard
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'phone_number']

    @action(detail=True, methods=['post'], url_path='update-role')
    def update_role(self, request, pk=None):
        """
        Custom action to change a user's role (e.g., from buyer to seller).
        """
        user = self.get_object()
        new_role = request.data.get('role')
        
        # Simple validation for roles
        valid_roles = ['buyer', 'seller', 'admin']
        if new_role not in valid_roles:
            return Response(
                {'error': 'Invalid role provided.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.role = new_role
        user.save()
        return Response({'status': f'User role updated to {new_role}'})
class BookViewSet(viewsets.ModelViewSet):
    # queryset = Book.objects.filter(is_approved=True).exclude(status='pending')
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
    'category': ['exact'],
    'condition': ['exact'],
    'status': ['exact'],
    'price': ['gte', 'lte'],
    }
    search_fields = ['title', 'author']
    ordering_fields = ['price', 'title']

    def get_permissions(self):
        # فقط ادمین اجازه دارد مستقیماً در این آدرس کتاب بسازد
        if self.action == 'create':
            return [permissions.IsAdminUser()]
        
        # برای تغییر یا حذف، حتماً باید صاحب کتاب باشد
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
            
        # بقیه موارد (دیدن لیست) آزاد است
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user

        # 1. ادمین همه چیز را می‌بیند
        if not user.is_anonymous and (user.is_staff or user.role == 'admin'):
            return Book.objects.all().order_by('-created_at')

        # 2. بقیه کاربران کتاب‌های تأیید شده را می‌بینند (چه موجود، چه فروخته شده)
        # فقط کتاب‌های pending (در انتظار تأیید) نمایش داده نمی‌شوند
        return Book.objects.filter(is_approved=True).exclude(status='pending').order_by('-created_at')
    def perform_update(self, serializer):
        """
        When a seller updates a book, if they try to change the status,
        it will be reset to 'pending' unless an admin is doing the update.
        """
        if self.request.user.is_staff or self.request.user.role == 'admin':
            serializer.save()
        else:
            # Re-verify the book if seller edits it
            serializer.save(
                is_approved=False, 
                status='pending'
            )
    def create(self, request, *args, **kwargs):
        """
        Disallow creating books through the main /api/books/ endpoint.
        Force sellers to use the my-inventory endpoint.
        """
        return Response(
            {"detail": "To add a book, please use the 'my-inventory' endpoint."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def perform_create(self, serializer):
        """
        When a seller creates a book, status is forced to 'pending' 
        regardless of what they sent in the request.
        """
        if self.request.user.is_staff or self.request.user.role == 'admin':
            serializer.save()
        else:
            # Force status and approval for regular sellers
            serializer.save(
                seller=self.request.user, 
                is_approved=False, 
                status='pending'
            )
    # core/views.py inside BookViewSet

    @action(detail=False, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticated], url_path='my-inventory')
    def my_inventory(self, request):
        user = request.user
        
        # Security check: Only sellers or admins
        if user.role != 'seller' and not user.is_staff:
            return Response({"detail": "Only sellers can access inventory."}, status=403)

        # --- Handle POST (Create Book) ---
        if request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            # Force seller and status
            serializer.save(seller=user, is_approved=False, status='pending')
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # --- Handle GET (List My Books) ---
        user_books = Book.objects.filter(seller=user).order_by('-created_at')
        page = self.paginate_queryset(user_books)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(user_books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser], url_path='approve')
    def approve(self, request, pk=None):
        """
        Custom action for Admin to approve a book.
        This changes is_approved to True and status to 'available' via model save() logic.
        """
        book = self.get_object()
        book.is_approved = True
        book.status = 'available'
        # Model's save() method will handle switching status from 'pending' to 'available'
        book.save()
        
        # Notify the seller automatically
        Notification.objects.create(
            user=book.seller,
            message=f"Book approved: '{book.title}' is now visible to buyers."
        )
        return Response({'status': 'Book approved successfully'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser], url_path='reject')
    def reject(self, request, pk=None):
        """
        Custom action for Admin to reject/unapprove a book.
        It sets is_approved to False and notifies the seller.
        """
        book = self.get_object()
        book.is_approved = False
        book.status = 'pending'
        book.save()

        # Create a notification for the seller about the rejection
        Notification.objects.create(
            user=book.seller,
            message=f"Unfortunately, your book '{book.title}' was rejected and set back to pending."
        )
        
        return Response({
            'status': 'Book rejected',
            'seller_notified': True
        }, status=status.HTTP_200_OK)

    
class CategoryViewSet(viewsets.ModelViewSet):
    """
    Manage book categories.
    List/Retrieve: Public
    Create/Update/Delete: Admin only
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        # Allow anyone to see, but only Admin to modify
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        # اگر کاربر بخواهد سفارش را ببیند (retrieve)، تغییر دهد یا حذف کند
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        # برای ثبت سفارش جدید (create) یا دیدن لیست کل سفارشات خودش (list)
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # ادمین همه را می‌بیند، کاربر معمولی فقط خریدهای خودش
        if self.request.user.is_staff or self.request.user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(buyer=self.request.user)

    # def perform_create(self, serializer):
    #     book = serializer.validated_data['book']
        
    #     # Check if the book is already sold
    #     if book.status == 'sold':
    #         raise ValidationError("This book is already sold and cannot be purchased again.")

    #     # Save the order and update book status
    #     order = serializer.save(buyer=self.request.user)
    #     book.status = 'sold'
    #     book.save()
    def create(self, request, *args, **kwargs):
        # این متد جایگزین perform_create می‌شود تا بتوانیم پاسخ سفارشی (Response) برگردانیم
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        book = serializer.validated_data['book']
        
        # 1. بررسی وضعیت کتاب
        if book.status == 'sold':
            raise ValidationError("This book is already sold.")

        # 2. ثبت سفارش با وضعیت پرداخت شده
        order = serializer.save(buyer=self.request.user, status='paid')

        # 3. ایجاد خودکار تراکنش (Transaction)
        transaction = Transaction.objects.create(
            order=order,
            amount=book.price,
            status='success',
            ref_id=str(uuid.uuid4())[:8]
        )

        # 4. آپدیت وضعیت کتاب
        book.status = 'sold'
        book.save()

        # 5. برگرداندن فاکتور آنی
        return Response({
            "message": "Purchase completed successfully!",
            "order_details": {
                "order_id": order.id,
                "book": book.title,
                "price": str(book.price),
                "tracking_code": transaction.ref_id,
                "date": order.created_at
            }
        }, status=status.HTTP_201_CREATED)
    from rest_framework.decorators import action
    from rest_framework.response import Response
    import uuid
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        order = self.get_object()
        
        if order.status == 'paid':
            return Response({'error': 'Order already paid'}, status=400)

        # Simulating a successful transaction
        transaction, created = Transaction.objects.get_or_create(
            order=order,
            defaults={'amount': order.book.price}
        )
        
        # Update Transaction and Order
        transaction.status = 'success'
        transaction.ref_id = str(uuid.uuid4())[:8] # Generating a random tracking code
        transaction.save()

        order.status = 'paid'
        order.save()

        # Update Book Status to Sold
        order.book.status = 'sold'
        order.book.save()

        return Response({
            'message': 'Payment successful',
            'tracking_code': transaction.ref_id
        })
    
    @action(detail=False, methods=['get'], url_path='my-invoices')
    def my_invoices(self, request):
        # Only show paid orders for the logged-in user
        user_invoices = Order.objects.filter(buyer=request.user, status='paid')
        serializer = InvoiceSerializer(user_invoices, many=True)
        return Response(serializer.data)
    
    
from rest_framework.decorators import action

# core/views.py

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    
    def get_permissions(self):
        """
        Custom permissions: 
        Only Admins can create or delete notifications manually.
        Authenticated users can view their own notifications or mark them as read.
        """
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """
        Regular users only see their own notifications.
        Admins can see everything.
        """
        if self.request.user.is_staff:
            return Notification.objects.all().order_by('-created_at')
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        """
        Allows users to mark their own notification as read.
        """
        notification = self.get_object()
        # Ensure users can only mark their own notifications
        if notification.user != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
            
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    def retrieve(self, request, *args, **kwargs):
        """
        When a user fetches a single notification detail, 
        mark it as read automatically.
        """
        instance = self.get_object()
        
        # Only mark as read if it hasn't been read yet
        if not instance.is_read:
            instance.is_read = True
            instance.save()
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
from .models import Category
from .serializers import CategorySerializer 
# class CategoryViewSet(viewsets.ReadOnlyModelViewSet): 
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class PasswordResetRequestView(APIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            reset_code = str(random.randint(1000, 9999))
            user.reset_code = reset_code
            user.save()
            
            return Response({
                "message": "Verification code generated successfully.",
                "code_for_testing": reset_code
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PasswordResetConfirmView(APIView):
    # این خط باعث می‌شود فیلدها در صفحه نمایش داده شوند
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        # استفاده از سریالایزر برای اعتبارسنجی داده‌ها
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            contact = serializer.validated_data['contact']
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']

            user = User.objects.filter(Q(email=contact) | Q(phone_number=contact)).first()

            if user and hasattr(user, 'reset_code') and user.reset_code == code:
                user.set_password(new_password)
                user.reset_code = None
                user.save()
                return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)
            
            return Response({"error": "Invalid code or contact info."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # این متد باعث می‌شود که API فقط اطلاعات خود کاربر لاگین شده را برگرداند
        return self.request.user
    
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'buyer':
            # خریدهایی که این کاربر انجام داده
            orders = Order.objects.filter(buyer=user)
        else:
            # فروش‌هایی که برای این فروشنده ثبت شده
            orders = Order.objects.filter(book__seller=user)
        
        # در اینجا باید اطلاعات را با یک Serializer به JSON تبدیل کنید
        # serializer = OrderSerializer(orders, many=True)
        # return Response(serializer.data)
        return Response({"message": "order list"})
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderHistorySerializer

class UserActivityHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user # کاربری که همین الان لاگین کرده
        
        # فقط سفارشاتی که این شخص خریده است (مرتب شده بر اساس جدیدترین)
        purchases = Order.objects.filter(buyer=user).order_by('-created_at')
        
        # فقط سفارشاتی که مربوط به کتاب‌های فروشی این شخص است (مرتب شده بر اساس جدیدترین)
        sales = Order.objects.filter(book__seller=user).order_by('-created_at')

        return Response({
            "purchases": OrderHistorySerializer(purchases, many=True).data,
            "sales": OrderHistorySerializer(sales, many=True).data
        })
    
class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer # باید در serializers.py ساخته شود
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # هر کس فقط علاقه‌مندی‌های خودش را ببیند
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see transactions related to their own orders
        return Transaction.objects.filter(order__buyer=self.request.user)
    
class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins see all tickets, regular users see only their own
        if self.request.user.is_staff:
            return SupportTicket.objects.all().order_by('-created_at')
        return SupportTicket.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically set the user to the current logged-in user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser], url_path='reply')
    def reply(self, request, pk=None):
        """
        Custom action for Admin to reply to a ticket and mark it as resolved.
        """
        ticket = self.get_object()
        # Admin provides 'admin_reply' in the request body
        reply_message = request.data.get('admin_reply')
        
        if reply_message:
            ticket.admin_reply = reply_message
            ticket.is_resolved = True
            ticket.save()
            
            # Send notification to the user who opened the ticket
            Notification.objects.create(
               user=ticket.user,
                message=f"Admin has replied to your ticket regarding: {ticket.get_subject_display()}"
            )
            return Response({'status': 'Response sent and ticket marked as resolved.'})
            
        return Response({'error': 'Please provide admin_reply text.'}, status=status.HTTP_400_BAD_REQUEST)
    
# core/views.py

class AdminReportView(APIView):
    """
    API View for Admin to get system-wide reports and statistics.
    Only accessible by Admin/Staff users.
    """
    # permission_classes = [permissions.IsAdminUser]
    # permission_classes = [IsAuthenticated]  
    permission_classes = [AllowAny]  # حالا همه می‌تونن GET بزنن، حتی بدون ورود



    def get(self, request):
        # 1. Count active users (is_active=True)
        active_users_count = User.objects.filter(is_active=True).count()
        
        # 2. Count total registered books
        total_books_count = Book.objects.count()
        
        # 3. Extra stats: count approved vs pending books
        approved_books = Book.objects.filter(is_approved=True).count()
        pending_books = Book.objects.filter(is_approved=False).count()

        # Returning the data in a clean dictionary
        return Response({
            "active_users": active_users_count,
            "total_books": total_books_count,
            "books_breakdown": {
                "approved": approved_books,
                "pending": pending_books
            }
        }, status=status.HTTP_200_OK)



# core/views.py

class SellerSalesView(APIView):
    """
    API View for sellers to track their successful sales and revenue.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Security check: only users with 'seller' role or admins
        if request.user.role != 'seller' and not request.user.is_staff:
            return Response({"error": "Access denied. Seller role required."}, status=403)

        # Get all paid orders for books owned by this seller
        sales = Order.objects.filter(book__seller=request.user, status='paid').select_related('book', 'buyer')
        
        total_revenue = sum(order.book.price for order in sales)
        
        sales_data = [{
            "order_id": order.id,
            "book_title": order.book.title,
            "price": order.book.price,
            "buyer": order.buyer.username,
            "purchase_date": order.created_at,
            "status": order.status
        } for order in sales]

        return Response({
            "total_sales_count": sales.count(),
            "total_revenue": total_revenue,
            "sales_history": sales_data
        }, status=status.HTTP_200_OK)
    


