from django.urls import path
from .views import (
    RegisterView, LoginView, EmailActivationView, PhoneVerificationView, 
    VerifyPhoneOtpView, UserProfileView,LogoutView, TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('activate-email/', EmailActivationView.as_view(), name='activate_email'),
    path('verify-phone/', PhoneVerificationView.as_view(), name='verify_phone'),
    path('verify-phone-otp/', VerifyPhoneOtpView.as_view(), name='verify_phone_otp'),
    path('profile/', UserProfileView.as_view(), name='profile'),
     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
]