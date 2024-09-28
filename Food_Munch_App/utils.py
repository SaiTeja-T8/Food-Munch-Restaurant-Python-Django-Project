from django.core.mail import send_mail
import random
import string

def generate_otp(length=6):
    """Generate a numeric OTP of given length."""
    digits = string.digits
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp

def send_otp_email(email):
    otp = generate_otp()
    subject = 'Food Munch Restaurant'
    message = f'Your OTP code is {otp}.Use this to complete your verification.Valid for 5 minutes.'
    email_from = 'mintusaiteja0068@gmail.com'  # Replace with your email address
    recipient_list = [email]
    
    send_mail(subject, message, email_from, recipient_list)
    
    return otp
