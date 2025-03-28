from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "username", "email","password")  

    extra_kwargs = {
        "password": {"write_only": True},  # Hide password from responses
        "email": {"required": True},
        "username": {"required": True},
        
    }

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "is_active") 

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Ensure `self.user` exists before accessing attributes
        user = self.user if hasattr(self, 'user') else None

        if user:
            data["username"] = user.username  

        return data


