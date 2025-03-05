from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, first_name="", last_name="", **extra_fields):
        """Creates and returns a regular user."""
        if not username:
            raise ValueError(_("Users must submit a username"))
        if not email:
            raise ValueError(_("Base User Account: An email address is required"))

        email = self.normalize_email(email)
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email address"))

        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user = self.model(
            username=username,
            first_name=first_name,  
            last_name=last_name,    
            email=email,
            **extra_fields
        )
        user.set_password(password)  
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, first_name="", last_name="", **extra_fields):
        """Creates and returns a superuser."""
        if not password:
            raise ValueError(_("Superusers must have a password"))

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields["is_staff"] is not True:
            raise ValueError(_("Superusers must have is_staff=True"))
        if extra_fields["is_superuser"] is not True:
            raise ValueError(_("Superusers must have is_superuser=True"))

        return self.create_user(username, email, password, first_name, last_name, **extra_fields)



        



