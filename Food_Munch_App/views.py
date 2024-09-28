from django.shortcuts import render
from django.shortcuts import redirect,get_object_or_404
from django.http import HttpResponse,JsonResponse
from random import randint
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth import login
from .models import *
from django.urls import reverse
from datetime import datetime
import re
import http.client
from django.conf import settings
from django.contrib.auth.decorators import login_required
from .utils import *
from django.views.decorators.csrf import csrf_exempt


# Create your views here.

def Login(request):
    EmailId=request.POST.get("LoginEmailId")
    Password=request.POST.get("LoginPassword")
    ErrorFlag=False
    ErrorMsgList=[]
    if request.method=="POST":
        AuthenticatedUser=authenticate(request,username=EmailId,password=Password)
        if AuthenticatedUser is not None:
            login(request,AuthenticatedUser)
            ExistingUser=SignupSection.objects.filter(EmailId=EmailId).first()
            if ExistingUser:
                ErrorFlag=False
                request.session["user_id"]=ExistingUser.id
                NewUser=LoginSection.objects.create(User=ExistingUser)
                NewUser.save()
                UserId=request.session["user_id"]
                email=EmailId
                otp = send_otp_email(email)
                request.session["Otp"]=otp
                return render(request,'OTPVerification.html',{"otp":otp})
                #return redirect(reverse("Validate Otp", kwargs={"UserId": UserId}))
            else:
                ErrorFlag=True
                ErrorMsgList.append("Invalid email or password")
                LoginDetails={
                    "ErrorFlag":ErrorFlag,
                    "ErrorMsgList":ErrorMsgList
                }
                return render(request,"LoginPage.html",context=LoginDetails)
        else:
            ErrorFlag=True
            ErrorMsgList.append("User Authentication Faild. Please Try after some time")
            LoginDetails={
                "ErrorFlag":ErrorFlag,
                "ErrorMsgList":ErrorMsgList
            }
            return render(request,"LoginPage.html",context=LoginDetails)
    else:
        if request.session.get("user_id"):
            return redirect("RestrauntMainPage",UserId=request.session["user_id"])
        else:
            return render(request,"LoginPage.html")

def ValidateOtp(request):
    Otp=request.session.get("Otp")
    UserId=request.session.get("user_id")
    ErrorMsgList=[]
    if request.method=="POST":
        n1=request.POST.get("Input1")
        n2=request.POST.get("Input2")
        n3=request.POST.get("Input3")
        n4=request.POST.get("Input4")
        n5=request.POST.get("Input5")
        n6=request.POST.get("Input6")
        EnteredOTP=n1+n2+n3+n4+n5+n6
        if EnteredOTP==Otp:
            return redirect("RestrauntMainPage",UserId=request.session["user_id"])
        else:
            ErrorMsgList.append("Invalid OTP")
            SubmitForm={
                "ErrorMsgList":ErrorMsgList,
                "Otp":Otp,
            }
            return render(request,'OTPVerification.html',context=SubmitForm)
    else:
        return render(request,"OTPVerification.html")
    

def signup(request):
    CustomerName=request.POST.get("SignupCustomerName")
    MobileNumber=request.POST.get("SignupMobileNumber")
    EmailId=request.POST.get("SignupEmailId")
    Password1=request.POST.get("SignupPassword1")
    Password2=request.POST.get("SignupPassword2")
    regex='^\w+([\.-]?\w+)+@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    ErrorFlag=False
    ErrorMsgList=[]
    if request.method=="POST":
        ExistingUserEmailId=SignupSection.objects.filter(EmailId=EmailId).first()
        ExistingUserMobileNumber=SignupSection.objects.filter(MobileNumber=MobileNumber).first()
        ExistingAuthUser=User.objects.filter(username=EmailId).first()
        if ExistingUserEmailId or ExistingUserMobileNumber or ExistingAuthUser:
            ErrorFlag=True
            ErrorMsgList.append("User with this email id or mobile number already exists")
            SignupDetails={
                "ErrorFlag":ErrorFlag,
                "ErrorMsgList":ErrorMsgList
            }
            return render(request,'SignupPage.html',context=SignupDetails)
        else:
            if Password1==Password2 and (len(MobileNumber)==10 and MobileNumber.isnumeric()) and re.search(regex,EmailId):
                ErrorFlag=False
                AuthenticatedUser=User.objects.create_user(username=EmailId,password=Password2)
                AuthenticatedUser.save()
                NewUser=SignupSection(CustomerName=CustomerName,MobileNumber=MobileNumber,EmailId=EmailId,Password=Password2)
                NewUser.save()
                ValidateUser=authenticate(request,username=EmailId,password=Password2)
                if ValidateUser is not None:
                    login(request,ValidateUser)
                    request.session["user_id"]=NewUser.id
                    UserId=request.session["user_id"]
                    return redirect(reverse("RestrauntMainPage",kwargs={"UserId":UserId}))
                else:
                    ErrorFlag=True
                    ErrorMsgList.append("Authentication Faild. Try again later")
                    SignupDetails={
                        "ErrorFlag":ErrorFlag,
                        "ErrorMsgList":ErrorMsgList,
                    }
                    return render(request,"SignupPage.html",context=SignupDetails)
            else:
                if not Password1==Password2:
                    ErrorFlag=True
                    ErrorMsgList.append("Password did not match")
                if not len(MobileNumber)==10:
                    ErrorFlag=True
                    ErrorMsgList.append("Mobile Number must be exactly 10 digits")
                if not MobileNumber.isdigit():
                    ErrorFlag=True
                    ErrorMsgList.append("Mobile Number must be only numbers not alphabets or any other or any special characters")
                if not re.search(regex,EmailId):
                    ErrorFlag=True
                    ErrorMsgList.append("Invalid Email Id")
                SignUpDetails={
                    "ErrorFlag":ErrorFlag,
                    "ErrorMsgList":ErrorMsgList
                }
                return render(request,'SignupPage.html',context=SignUpDetails)
    else:
         return render(request,"SignupPage.html")   

def LogOut(request):
    request.session.clear()
    return redirect("login")

def RestrauntMainPage(request,UserId):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginDetails=SignupSection.objects.get(id=UserId)
    request.session["LoginMember"]=LoginDetails.CustomerName
    LoginMember=request.session["LoginMember"]
    RestaurantItems=RestaurantMenuCard.objects.all()
    RestaurantItemsList=[{"FoodItemName":Item.ItemName,"FoodItemImage":Item.ItemImage.url} for Item in RestaurantItems]
    ImagesFolder=os.path.join(settings.BASE_DIR,"static","FollowUs_Images")
    Images=[f'FollowUs_Images/{file}' for file in os.listdir(ImagesFolder) if file.endswith(('png', 'jpg', 'jpeg', 'gif'))]
    Products=Product.objects.all()
    ProductItemsList=[{
        "ProductId":Item.id,
        "ProductName":Item.ProductName,
        "ProductImage":Item.ProductImage, 
        "ProductCost":Item.ProductCost,
        "ProductQuantity":Item.ProductQuantity
    } for Item in Products]
    return render(request,'BasicRestrauntStructure.html',{"LoginMember":LoginMember,"UserId":UserId,"ProductItemsList":ProductItemsList,"CartItemCount":CartItemCount,"RestaurantItemsList":RestaurantItemsList,"Images":Images})

def productsList(request):
    UserId=request.session.get("user_id")
    CurrentUser=SignupSection.objects.get(id=UserId)
    LoginMember=CurrentUser.CustomerName
    CartItemCount=request.session.get("CartItemCount",0)
    SelectedItem=request.GET.get("item")
    FilterSearchResults=Product.objects.get(ProductName__iexact=SelectedItem)
    GetCategoryName=FilterSearchResults.ProductCategory
    FilteredCategoryName=Product.objects.filter(ProductCategory=GetCategoryName).exclude(id=FilterSearchResults.id)
    SimilarProductsList=[{"ProductName":Item.ProductName,"ProductImage":Item.ProductImage,"ProductCost":Item.ProductCost,"ProductQuantity":Item.ProductQuantity,"ProductCategory":Item.ProductCategory.CategoryName,"ProductId":Item.id} for Item in FilteredCategoryName]
    return render(request,"ProductsList.html",{"UserId":UserId,"SimilarProductsList":SimilarProductsList,"CartItemCount":CartItemCount,"LoginMember":LoginMember})
    
def exploremenu(request):
    CartItemCount=request.session.get("CartItemCount",0)
    LoginUser={
        "UserId":request.session["user_id"],
        "LoginMember":request.session["LoginMember"],
        "CartItemCount":CartItemCount
    }
    return render(request,'ExploreMenuSection.html',context=LoginUser)

def viewmenu_Non_Veg_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Non_Veg")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    NonVeg_Items={
        "SectionName":"Non-Veg_Items_Images",
        "FoodItem":"Non-Veg Starters",
        "UniqueId":"UI80001",
        "ItemDetails":zip(["chicken-biryani","Tilapia-with-Tomatoes","egg-dum-biryani","afghani-tandoori-chicken_360","grilled-chicken","biryani","fish-finger","badam-korma"],["Chicken Biryani Jambo Pack","Brazilian Fish Stew","Egg Dum Biryani","Fish Dum Biryani","Grilled Chicken Escalope with Fresh Salsa","Malabar Fish Biryani","Curried Parmesan Fish Fingers","Mutton Korma"],["$ 5.79","$ 3.96","$ 2.89","$ 4.00","$ 4.89","$ 7.28","$ 5.12","$ 3.11"])
        }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Veg_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Veg")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Veg_Items={
        "SectionName":"Veg_Items_Images",
        "FoodItem":"Veg Starters",
        "UniqueId":"UI80002",
        "ItemDetails":zip(["Chevre-and-Tomato-Tart","coconut-curry-cauliflower","Eggplant-Parmigiana-Vegetarian-Dish","Jackfruit-Enchiladas","Pesto-Zoodles-Vegetarian-dish","Ricotta-Wheat-Pizza","Veggie-mushroom-burger","veggie-primavera"],["Chevre and Tomato Tart","Coconut Curry Cauliflower","Eggplant Parmigiana Vegetarian Dish","Jackfruit Enchiladas","Pesto Zoodles Vegetarian Dish","Ricotta Wheat Pizza","Veggie Mushroom Burger","Veggie Primavera"],["$ 5.00","$ 3.88","$ 4.00","$ 2.69","$ 4.33","$ 1.53","$ 1.42","$ 2.27"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Soups_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Soups")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Soups_Items={
        "SectionName":"Soups_Images",
        "FoodItem":"Soups",
        "UniqueId":"UI80003",
        "ItemDetails":zip(["Vegetable-Quinoa-Soup-Vegetarian","minestrone-soup","Vegan-Tomato-Soup","Roasted-Butternut-Squash-Soup","Roasted-Tomato-soup","Easy-and-Delicious-Minestrone-Soup","tomato-beetroot-carrot-soup","Green-Soup"],["Vegetable Quinoa Soup","Minestrone Soup","Vegan Tomato Soup","Roasted Butternut Squash Soup","Roasted Tomato Soup","Minestrone Soup","Tomato Beetroot Carrot Soup","Green Soup"],["$ 2.23","$ 3.99","$ 2.09","$ 4.04","$ 1.47","$ 3.18","$ 4.33","$ 3.55"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Fish_and_Sea_Food_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Fish and Sea Food")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Fish_and_Sea_Food_Items={
        "SectionName":"Fish_and_Sea_Food_Item_Images",
        "FoodItem":"Fish & Sea Food",
        "UniqueId":"UI80004",
        "ItemDetails":zip(["Southeast-Asian-Food-Tom-Yum-Goong","Shark and Ray Gardens","Mediterranean Octopus","gaint-river-prawn","stir-fired-crab","teriyaki-shark-steaks","blue-jellyfish","Mustelids"],["Southeast Asian Food Tom-Yum-Goong","Shark and Ray Gardens","Mediterranean Octopus","Gaint River Prawn","Stir Fired Crab","Teriyaki Shark Steaks","Blue Jelly Fish","Mustelids"],["$ 31.13","$ 12.65","$ 15.80","$ 17.78","$ 16.80","$ 19.99","$ 22.57","$ 22.01"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Main_Course_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Main Course")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Main_Course_Items={
        "SectionName":"Main_Course_Images",
        "FoodItem":"Main Course",
        "UniqueId":"UI80005",
        "ItemDetails":zip(["Slow-Cooker-Butter-Chicken","Chicken-Korma","Mughali-Chicken","Easy-Chana-Masala","dal-makhani-indian-food","Gobi-Aloo","parsi-brown-rice","Kati Rolls"],["Butter Chicken","Chicken Korma","Mughali Chicken","Chana Masala","Dal Makhani Indian Food","Gobi Aloo","Parsi Brown Rice","Kati Rolls"],["$ 3.67","$ 1.42","$ 2.05","$ 2.55","$ 4.68","$ 1.44","$ 1.11","$ 1.66"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Noodles_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Noodles")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Noodles_Items={
        "SectionName":"Noodles_Images",
        "FoodItem":"Noodles",
        "UniqueId":"UI80006",
        "ItemDetails":zip(["maagi-noodles","veg-noodles","vegetable-chow-mein-noodles","pasta-carbonara-recipe","green-noodles-with-spinach-pesto","Thai-Basil-Noodles-with-eggs","chicken-noodles","cold-soba-noodles"],["Maagi Noodles","Veg Noodles","Vegetable Chow Mein Noodles","Pasta Carbonara Recipe","Green Noodles With Spinach Pesto","Thai Basil Noodles with Eggs","Chicken Noodles","Cold Soba Noodles"],["$ 4.34","$ 1.82","$ 2.50","$ 2.22","$ 1.45","$ 3.12","$ 1.99","$ 0.77"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Salads_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Salads")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Salads_Items={
        "SectionName":"Salads_Images",
        "FoodItem":"Salads",
        "UniqueId":"UI80007",
        "ItemDetails":zip(["vegetable-salad-recipe","creamy-cucumber-dill-salad","boiled-peanut-salad","edamame-corn-salad","beetroot-chickpea-salad","mango-avocado-salad","watermelon-salad","macaroni-salad"],["Vegetable Salad Recipe","Creamy Cucumber Dill Salad","Boiled Peanut Salad","Edamame Corn Salad","Beetroot Chickpea Salad","Mango Avocado Salad","Watermelon Salad","Macaroni Salad"],["$ 2.54","$ 1.29","$ 2.08","$ 1.56","$ 1.98","$ 3.85","$ 3.88","$ 3.82"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def viewmenu_Desserts_Section(request):
    CartItemCount=request.session.get("CartItemCount",0)
    UserId=request.session["user_id"]
    LoginMember=request.session["LoginMember"]
    CategoryList=Category.objects.get(CategoryName="Desserts")
    ProductList=Product.objects.filter(ProductCategory=CategoryList)
    """
    Desserts_Items={
        "SectionName":"Desserts_Images",
        "FoodItem":"Desserts",
        "UniqueId":"UI80008",
        "ItemDetails":zip(["strawberry-crunch-poke-cake","key-lime-pie-mousse","granita","dolewhip","nutellapops","Buckeye Bundt Cake","Sweet-Homemade-Pastel-Cupcakes","Chocolate-Cakes"],["Strawberry Crunch Poke Cake","Key Lime Pie Mousse","Granita","Dolewhip","Nutellapops","Buckeye Bundt Cake","Sweet Homemade Pastel Cupcakes","Chocolate Cakes"],["$ 8.34","$ 8.49","$ 9.45","$ 13.67","$ 12.65","$ 10.00","$ 11.21","$ 11.11"])
    }
    """
    return render(request,'ViewMenuSection.html',{"ProductList":ProductList,"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":CartItemCount})

def watch_video(request):
    UserId=request.session.get("user_id")
    CurrentUser=SignupSection.objects.get(id=UserId)
    LoginMember=CurrentUser.CustomerName
    CartItemCount=request.session.get("CartItemCount",0)
    VideoItem=Video.objects.all()
    VideoItem={
        "VideoItem":VideoItem,
        "UserId":UserId,
        "CartItemCount":CartItemCount,
        "LoginMember":LoginMember
    }
    return render(request,"Video.html",context=VideoItem)

def paymentgateway(request):
    ErrorFlag=False
    ErrorMsgList=[]
    regex='^\w+([\.-]?\w+)+@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    CurrentDate=datetime.now()
    CurrentYear=CurrentDate.year
    CurrentMonth=CurrentDate.month  
    UserId=request.session["user_id"]
    SignupDetails=SignupSection.objects.get(id=UserId)
    CustomerName=SignupDetails.CustomerName
    CustomerMobileNumer=SignupDetails.MobileNumber
    CustomerEmailId=SignupDetails.EmailId

    if request.method=="POST":
        CustomerName=request.POST.get("CustomerFullName")
        EmailId=request.POST.get("CustomerEmailId")
        MobileNumber=request.POST.get("CustomerMobileNumber")
        Address=request.POST.get("CustomerAddress")
        City=request.POST.get("CustomerCity")
        State=request.POST.get("CustomerState")
        PinCode=request.POST.get("CustomerPinCode")
        PaymentMethod=request.POST.get("CustomerPaymentMethod")
        CardName=request.POST.get("CustomerCardName")
        CardNumber=request.POST.get("CustomerCardNumber")    
        CardExpiry=request.POST.get("CustomerCardExpiry")
        Cvv=request.POST.get("CustomerCvv")
        

        if int(CardExpiry[3:])>CurrentYear:
            ErrorFlag=False
        elif int(CardExpiry[3:])==CurrentYear:
            if int(CardExpiry[:2])>=CurrentMonth:
                ErrorFlag=False
            else:
                ErrorFlag=True
                ErrorMsgList.append("Your Card has expired its month. Finish the payment usying another card")
        else:
            ErrorFlag=True
            ErrorMsgList.append("Your Card has expired its year. Finish the payment usying another card")
        if not len(MobileNumber)==10:
            ErrorFlag=True
            ErrorMsgList.append("Mobile Number must be exactly 10 digits")
        if not MobileNumber.isnumeric():
            ErrorFlag=True
            ErrorMsgList.append("Mobile Number must contain only digits not alphabets or any special characters")
        if not CardName.upper() in ["VISA","MASTERCARD","RUPAY","MAESTRO","UNIONPAY","AMERICAN EXPRESS","DISCOVER","JCB","DINERS CLUB","CIRRUS"]:
            ErrorFlag=True
            ErrorMsgList.append("Card is Not Acceptable.Try usying another card")
        if not len(PinCode)==6:
            ErrorFlag=True
            ErrorMsgList.append("PinCode must be exactly 6 digits")
        if len(Cvv)!=3:
            ErrorFlag=True
            ErrorMsgList.append("Cvv must be exactly 3 digits")
        if not re.search(regex,EmailId):
            ErrorFlag=True
            ErrorMsgList.append("Not a valid Email address")
        if len(CardNumber)!=19:
            ErrorFlag=True
            ErrorMsgList.append("Card Number must be exactly 16 digits")
        if not ErrorFlag==True:
            StoreData=PaymentSectionDetails(CustomerName=CustomerName,EmailId=EmailId,MobileNumber=MobileNumber,Address=Address,City=City,State=State,PinCode=PinCode,PaymentMethod=PaymentMethod,CardName=CardName,CardNumber=CardNumber,CardExpiry=CardExpiry,Cvv=Cvv)
            #OrderData=OrderDetails(UserId=UserId,ProductName=ProductName,Cost=ProductCost,Quantity=ProductQuantity)
            StoreData.save()
            #OrderData.save()
            return render(request,'SuccessPage.html',{"UserId":request.session.get("user_id")})
        else:
            SubmitForm={
                "ErrorFlag":ErrorFlag,
                "ErrorMsgList":ErrorMsgList,
                "UserId":UserId,
                "CustomerName":CustomerName,
                "CustomerMobileNumer":CustomerMobileNumer,
                "CustomerEmailId":CustomerEmailId
            }
            return render(request,'PaymentSection.html',context=SubmitForm)
    else:
        return render(request,"PaymentSection.html",{"UserId":UserId,"CustomerName":CustomerName,"CustomerMobileNumer":CustomerMobileNumer,"CustomerEmailId":CustomerEmailId})


def successpage(request):
    UserId=request.session.get("user_id")
    return render(request,"SuccessPage.html",{"UserId":UserId})
            
    
@login_required
def AddtoCart(request):
    ProductImage=request.GET.get("ProductImage")
    ProductName=request.GET.get("ProductName")
    ProductCost=request.GET.get("ProductCost")
    ProductQuantity=request.GET.get("ProductQuantity")
    ProductId=request.GET.get("ProductId")
    ProductItems=Product.objects.get(id=ProductId)
    UserCart,Created=Cart.objects.get_or_create(User=request.user)
    CheckItems=CartItem.objects.filter(Cart=UserCart,Product=ProductItems).first()
    if CheckItems is None:
        UploadProductItems=CartItem(Cart=UserCart,Product=ProductItems,ProductImage=ProductImage,ProductName=ProductName,ProductCost=ProductCost,ProductQuantity=ProductQuantity)
        UploadProductItems.save()
        return redirect("Cart View")
    else:
        ProductCost=float(ProductCost)
        ProductQuantity=int(ProductQuantity)
        CheckItems.ProductQuantity=int(CheckItems.ProductQuantity)
        CheckItems.ProductQuantity+=ProductQuantity
        ProductCost = ProductCost * ProductQuantity
        CheckItems.ProductCost = float(CheckItems.ProductCost)  # Convert existing cost to float
        CheckItems.ProductCost += ProductCost  # Add the new cost
        CheckItems.ProductQuantity = str(CheckItems.ProductQuantity)
        CheckItems.ProductCost = str(CheckItems.ProductCost)
        CheckItems.save()
        return redirect("Cart View")
    
@login_required
def cart_view(request):
   UserId=request.session["user_id"]
   CurrentUser=SignupSection.objects.get(id=UserId)
   LoginMember=CurrentUser.CustomerName
   UsersCart=Cart.objects.filter(User=request.user).first()
   if UsersCart:
       CartItemsList=CartItem.objects.filter(Cart=UsersCart)
       CartItemCount=CartItemsList.count()
       request.session["CartItemCount"]=CartItemCount
       return render(request,"Cart.html",{"CartItemsList":CartItemsList,"CartItemCount":CartItemCount,"UserId":UserId,"LoginMember":LoginMember})
   else:
       return render(request,"Cart.html",{"UserId":UserId,"LoginMember":LoginMember,"CartItemCount":0})


@csrf_exempt
def DeleteCartItem(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')

        try:
            quantity = int(quantity)
        except ValueError:
            return redirect('Cart View')  

        try:
            cart_item = CartItem.objects.get(id=product_id)
        except CartItem.DoesNotExist:
            return redirect('Cart View')

        product_quantity = int(cart_item.ProductQuantity)

        # Compareing quantity and update the cart
        if quantity >= product_quantity:
            cart_item.delete()
        else:
            cart_item.ProductQuantity = product_quantity - quantity
            cart_item.save()

        return redirect('Cart View')

@csrf_exempt
def UpdateCartQuantity(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        action = request.POST.get('action')  # Either "increase" or "decrease"
        
        try:
            cart_item = CartItem.objects.get(id=product_id)
        except CartItem.DoesNotExist:
            return redirect('Cart View')

        product_quantity = int(cart_item.ProductQuantity)

        if action == 'increase':
            cart_item.ProductQuantity = product_quantity + 1
        elif action == 'decrease' and product_quantity > 1:
            cart_item.ProductQuantity = product_quantity - 1

        cart_item.save()
        return redirect('Cart View')
