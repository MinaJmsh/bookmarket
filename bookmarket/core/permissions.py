from rest_framework import permissions

class IsSellerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.seller == request.user
    
    from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, 'seller', getattr(obj, 'buyer', None))
        return owner == request.user
class IsSellerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff or getattr(request.user, 'role', None) == 'admin':
            return True
        return getattr(request.user, 'role', None) == 'seller'