from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Video)
admin.site.register(PaymentSectionDetails)
admin.site.register(SignupSection)
admin.site.register(LoginSection)
admin.site.register(OrderDetails)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(RestaurantMenuCard)


