from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, SupportTicket, Transaction, Notification

@receiver(post_save, sender=Transaction)
def create_payment_notification(sender, instance, created, **kwargs):
    """
    Automatically creates notifications for both buyer and seller 
    when a transaction is successfully completed.
    """
    if created and instance.status == 'success':
        # Notification for the Buyer
        Notification.objects.create(
            user=instance.order.buyer,
            message=f"Your payment for order #{instance.order.id} was successful. Tracking code: {instance.ref_id}"
        )
        
        # Notification for the Seller
        Notification.objects.create(
            user=instance.order.book.seller,
            message=f"Your book '{instance.order.book.title}' has been sold! Order #{instance.order.id} is ready for shipping."
        )

@receiver(post_save, sender=Order)
def create_order_status_notification(sender, instance, created, **kwargs):
    """
    Sends a notification to the buyer whenever the order status changes (e.g., Shipped).
    """
    if not created:
        Notification.objects.create(
            user=instance.buyer,
            message=f"The status of your order #{instance.id} has been updated to: {instance.status}."
        )
# core/signals.py

@receiver(post_save, sender=SupportTicket)
def notify_user_on_admin_reply(sender, instance, created, **kwargs):
    """
    Sends a notification to the user when an admin replies to their support ticket.
    """
    # Check if this is an update (not a new ticket) and if admin has provided a reply
    if not created and instance.admin_reply:
        # Create a notification for the user who opened the ticket
        Notification.objects.create(
            user=instance.user,
            message=f"Admin has replied to your ticket: '{instance.subject}'. Check support history."
        )