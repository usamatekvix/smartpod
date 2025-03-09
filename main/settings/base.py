from pathlib import Path
from datetime import timedelta
import environ
import os

env = environ.Env(DEBUG=(bool, False))
BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SETTINGS_ENV = env

SECRET_KEY = env('SECRET_KEY')
DEBUG = True

ALLOWED_HOSTS = ['192.168.1.3','192.168.1.4','172.21.32.1','localhost','127.0.0.1','192.168.1.7']
CSRF_TRUSTED_ORIGINS = ['http://192.168.1.4:8000','http://192.168.1.4:3000','http://192.168.1.4:3001','http://localhost:3001', 'http://localhost:3000','http://192.168.1.5:8000','http://192.168.1.3:3000','http://192.168.1.7:3000']

# Application definition
DJANGO_APPS=[
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sites',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

LOCAL_APPS=[
    'apps.video_upload',
    'apps.authentication',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'djoser',
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

INSTALLED_APPS= DJANGO_APPS + LOCAL_APPS + THIRD_PARTY_APPS

SITE_ID = 1




MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
]

AUTH_USER_MODEL = "authentication.User"

ROOT_URLCONF ='main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'


MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")



# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    'http://192.168.1.4:3000',  
    'http://192.168.1.3:3000',  
    'http://192.168.1.7:3000',  
    'http://192.168.1.4:3001',
    'http://localhost:3001',
    'http://192.168.1.5:8000',  
    "http://localhost:3000",  # Allow frontend app
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
      
    ),
    'DEFAULT_PERMISSION_CLASSES': [
   'rest_framework.permissions.AllowAny',
] 
}

# JWT Settings
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "UPDATE_LAST_LOGIN": True,
    "BLACKLIST_AFTER_ROTATION": True

}

#DJOSER CONFIGURATION
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE':False,
    "USER_ACTIVATION": False,
    'ACTIVATION_URL':'/activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL':False,
    'SEND_CONFIRMATION_EMAIL':False,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION':False,
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SET_PASSWORD_RETYPE': False,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
    'TOKEN_MODEL': None,       # To Delete User Must Set it to None
    'SERIALIZERS':{

    'user_create': 'apps.authentication.serializers.CustomUserCreateSerializer',
    'user': 'apps.authentication.serializers.CustomUserSerializer',
    'user_delete': 'djoser.serializers.UserDeleteSerializer',
    "token_obtain_pair": "authentication.serializers.CustomTokenObtainPairSerializer",
}


    }

AUTHENTICATION_BACKENDS = [ 
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',

]

SOCIALACCOUNT_PROVIDERS = {
    "github": {
        "VERIFIED_EMAIL": True
    },
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    },
}

# LOGIN_REDIRECT_URL = "/"  # Redirect to homepage or dashboard instead of login page
# ACCOUNT_LOGOUT_REDIRECT_URL = "/accounts/login/"  # Redirect to login page after logout


#LOGGING
import logging
import logging.config

from django.utils.log import DEFAULT_LOGGING

LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE_PATH = os.path.join(LOG_DIR, "main.log")

logger = logging.getLogger(__name__)

LOG_LEVEL = "INFO"

logging.config.dictConfig(
    {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "console": {
                "format": "%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
            },
            "file": {"format": "%(asctime)s %(name)-12s %(levelname)-8s %(message)s"},
            "django.server": DEFAULT_LOGGING["formatters"]["django.server"],
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "console",
            },
            "file": {
                "level": "INFO",
                "class": "logging.FileHandler",
                "formatter": "file",
                "filename": LOG_FILE_PATH,
            },
            "django.server": DEFAULT_LOGGING["handlers"]["django.server"],
        },
        "loggers": {
            "": {"level": "INFO", "handlers": ["console", "file"], "propagate": False},
            "apps": {"level": "INFO", "handlers": ["console", "file"], "propagate": False},
            "django.server": DEFAULT_LOGGING["loggers"]["django.server"],
        },
    }
)
