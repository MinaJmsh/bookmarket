from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# اضافه کردن ویوهای جدید به import
from .views import (
    AdminReportView, CategoryViewSet, FavoriteViewSet, RegisterView, SupportTicketViewSet, TransactionViewSet, UserActivityHistoryView, UserProfileView, UserViewSet, BookViewSet, 
    OrderViewSet, NotificationViewSet, PasswordResetRequestView, PasswordResetConfirmView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet, basename='book')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'favorites', FavoriteViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'support-tickets', SupportTicketViewSet, basename='support-ticket')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/history/', UserActivityHistoryView.as_view(), name='user-history'),
    path('admin-reports/', AdminReportView.as_view(), name='admin-reports'),
]