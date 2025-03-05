from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from djoser.serializers import TokenSerializer
from rest_framework import serializers


User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "phone_number","password")  

    extra_kwargs = {
        "password": {"write_only": True},  # Hide password from responses
        "email": {"required": True},
        "username": {"required": True},
        "phone_number": {"required": True},
    }


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email","phone_number", "is_active") 




from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Ensure `self.user` exists before accessing attributes
        user = self.user if hasattr(self, 'user') else None

        if user:
            data["username"] = user.username  # Add username to response

        return data


