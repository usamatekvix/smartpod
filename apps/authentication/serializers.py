from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "password")  # Removed first_name, last_name, and re_password

    extra_kwargs = {
        "password": {"write_only": True},  # Hide password from responses
        "email": {"required": True},
        "username": {"required": True},
    }


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "is_active") 

