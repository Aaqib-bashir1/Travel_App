from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import (
    RegisterSerializer, LoginSerializer, EmailActivationSerializer,
    PhoneVerificationSerializer, UserProfileSerializer, UpdateProfileSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import random
from datetime import timedelta
from django.utils import timezone
from .utils import generate_otp, send_otp_via_whatsapp, send_otp_via_sms

# Helper function to handle OTP expiration
def is_otp_expired(user):
    expiration_time = user.otp_generated_at + timedelta(minutes=10)  # OTP valid for 10 minutes
    return timezone.now() > expiration_time

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate a 6-digit OTP
            otp = random.randint(100000, 999999)
            user.otp = otp
            user.otp_generated_at = timezone.now()  # Track OTP generation time
            user.is_active = False  # Ensure activation is required
            user.otp_generated_at = timezone.now()  # Track OTP generation time
            user.save()

            # Send OTP via email
            try:
                subject = "🔐 Verify Your Email"
                plain_message = f"""Hey {user.first_name},

                We received a request to verify your email address. Use the OTP below to complete your verification process:

                Your OTP: {otp}

                If you didn’t request this verification, please ignore this email or contact support.

                
                The Team
                """ # Plain text message    
                message = f"""<html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f2f2f2;">
                    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">Hey {user.first_name},</h2>
                        <p>We received a request to verify your email address. Use the OTP below to complete your verification process:</p>
                        <p style="font-size: 24px; font-weight: bold; text-align: center; color: #000;">📬 Your OTP: {otp}</p>
                        <p>If you didn’t request this verification, please ignore this email or contact support.</p>
                        <p>Safe Travels,<br/>The Team</p>
                    </div>
                </body>
                </html>
                """ # HTML message
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                    html_message=message,
                )
                return Response(
                    {"message": "Registration successful. Check your email for the OTP."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response({"error": f"Email sending failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, email=serializer.validated_data['email'])
            if user.check_password(serializer.validated_data['password']):
                if not user.is_active:
                    return Response(
                        {"error": "Account is not activated."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Generate JWT tokens
              
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)
                
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailActivationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailActivationSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, email=serializer.validated_data['email'])

            if user.otp == serializer.validated_data['otp']:
                if is_otp_expired(user):
                    return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

                user.is_active = True
                user.otp = None  # Clear OTP after successful verification
                user.save()
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PhoneVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
    # Assuming you've already validated and retrieved the phone_number
        phone_number = request.data.get('phone_number')
        otp = generate_otp()

        method = request.data.get("method", "whatsapp")  # Choose method from request data

        if method == "whatsapp":
            sid = send_otp_via_whatsapp(phone_number, otp)
        else:
            sid = send_otp_via_sms(phone_number, otp)

        if sid:
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send OTP."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPhoneOtpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone_number")
        otp = request.data.get("otp")

        if not phone_number or not otp:
            return Response({"error": "Phone number and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(CustomUser, phone_number=phone_number)

        if user.otp == otp:
            if is_otp_expired(user):
                return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True  # Mark the user as verified
            user.otp = None  # Clear OTP
            user.save()
            return Response({"message": "Phone number verified successfully."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid OTP or phone number."}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserProfileSerializer, UpdateProfileSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch the current user object
        user = request.user
        # Serialize user data using the UserProfileSerializer
        serializer = UserProfileSerializer(user)
        # Return the serialized data in response
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        # Get the current user from the request
        user = request.user
        
        # Initialize the UpdateProfileSerializer with the user instance and incoming data
        serializer = UpdateProfileSerializer(user, data=request.data, partial=True)

        # Check if the data is valid
        if serializer.is_valid():
            # Save the updated user profile
            updated_user = serializer.save()

            # Re-serialize the updated user data to return the complete data after the update
            updated_serializer = UserProfileSerializer(updated_user)

            # Return the updated profile data as response
            return Response(updated_serializer.data, status=status.HTTP_200_OK)
        
        # Return validation errors if any
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the provided refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
