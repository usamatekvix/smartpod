from django.urls import path, include
from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='custom_jwt_create'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
