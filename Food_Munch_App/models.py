from django.db import models,IntegrityError
from django.utils import timezone
from django.contrib.auth.models import User
import random
import string
import os

# Create your models here.


class Video(models.Model):
    Title=models.CharField(max_length=500)
    Video_File=models.FileField(upload_to="videos")
    Upload_DateTime=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Title

class PaymentSectionDetails(models.Model):
    CustomerName=models.CharField(max_length=50)
    EmailId=models.CharField(max_length=100)
    MobileNumber=models.CharField(max_length=10)
    Address=models.CharField(max_length=100)
    City=models.CharField(max_length=30)
    State=models.CharField(max_length=30)
    PinCode=models.CharField(max_length=6)
    PaymentMethod=models.CharField(max_length=25)
    CardName=models.CharField(max_length=30)
    CardNumber=models.CharField(max_length=19)
    CardExpiry=models.CharField(max_length=7)
    Cvv=models.CharField(max_length=3)
    PaymentDateTime=models.DateTimeField(default=timezone.now)

class SignupSection(models.Model):
    CustomerName=models.CharField(max_length=50)
    MobileNumber=models.CharField(max_length=10,unique=True)
    EmailId=models.CharField(max_length=100,unique=True,default="")
    Password=models.CharField(max_length=50)
    DateOfRegisteration=models.DateTimeField(default=timezone.now)
    UserLastUpdate=models.DateTimeField(auto_now=True)

class LoginSection(models.Model):
    User=models.ForeignKey(SignupSection,on_delete=models.CASCADE,default=None)
    EmailId=models.CharField(max_length=100)
    Password=models.CharField(max_length=50)
    LoginDateTime=models.DateTimeField(auto_now=True)
    LoginStatus=models.BooleanField(default=True)

class OrderDetails(models.Model):
    UserId=models.CharField(max_length=1000)
    ProductName=models.CharField(max_length=500)
    Cost=models.CharField(max_length=8)
    Quantity=models.CharField(max_length=10)
    OrderDateTime=models.DateTimeField(auto_now=True)


def generate_unique_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

def CategoryProduct(instance, filename):
    # Create a path based on the category name
    return os.path.join(instance.ProductCategory.CategoryName, filename)

class Category(models.Model):
    CategoryName=models.CharField(max_length=100)

class Product(models.Model):
    ProductCategory=models.ForeignKey(Category,related_name="products",on_delete=models.CASCADE)
    ProductImage=models.ImageField(upload_to=CategoryProduct)
    ProductName=models.CharField(max_length=250)
    ProductCost=models.CharField(max_length=6)
    ProductQuantity=models.CharField(max_length=2,default=1)

class Cart(models.Model):
    User=models.OneToOneField(User,on_delete=models.CASCADE)
    CreatedAt=models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    Cart=models.ForeignKey(Cart,on_delete=models.CASCADE)
    Product=models.ForeignKey(Product,on_delete=models.CASCADE)
    ProductImage=models.ImageField(upload_to="CartItems/")
    ProductName=models.CharField(max_length=250)
    ProductCost=models.CharField(max_length=6,default="0")
    ProductQuantity=models.CharField(max_length=2,default=1)

class RestaurantMenuCard(models.Model):
    ItemImage=models.ImageField(upload_to="RestaurantMenuCard/")
    ItemName=models.CharField(max_length=50)


