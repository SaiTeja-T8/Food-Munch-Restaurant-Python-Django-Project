from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Cart

@receiver(post_save,sender=User)
def Create_UserCart(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(User=instance)

@receiver(post_save, sender=User)
def Save_UserCart(sender,instance,**kwargs):
    instance.cart.save()