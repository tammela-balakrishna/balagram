import os
from pathlib import Path

import dj_database_url


BASE_DIR = Path(__file__).resolve().parent.parent


# -------------------------
# helpers
# -------------------------
def env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name, default=""):
    raw_value = os.getenv(name, default)
    return [item.strip() for item in raw_value.split(",") if item.strip()]


# -------------------------
# core settings
# -------------------------
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-change-me-in-production",
)

DEBUG = env_bool("DJANGO_DEBUG", default=False)

RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")


# -------------------------
# allowed hosts
# -------------------------
DEFAULT_ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]

ALLOWED_HOSTS = sorted(
    set(
        DEFAULT_ALLOWED_HOSTS
        + env_list("DJANGO_ALLOWED_HOSTS", "balagram.onrender.com")
        + ([RENDER_EXTERNAL_HOSTNAME] if RENDER_EXTERNAL_HOSTNAME else [])
    )
)


# -------------------------
# apps
# -------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",

    "accounts.apps.AccountsConfig",
    "posts",
    "social",
    "messaging",
]


# -------------------------
# middleware
# -------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "instagram.urls"


# -------------------------
# templates
# -------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend_dist"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "instagram.wsgi.application"


# -------------------------
# database
# -------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# -------------------------
# auth
# -------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# -------------------------
# internationalization
# -------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"

USE_I18N = True
USE_TZ = True


# -------------------------
# static files
# -------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

FRONTEND_DIST_DIR = BASE_DIR / "frontend_dist"

STATICFILES_DIRS = (
    [FRONTEND_DIST_DIR]
    if FRONTEND_DIST_DIR.exists()
    else []
)

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# -------------------------
# media
# -------------------------
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# -------------------------
# django rest framework
# -------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}


# -------------------------
# cors + csrf
# -------------------------
DEFAULT_FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://balagram.onrender.com",
]

CORS_ALLOWED_ORIGINS = sorted(
    set(
        DEFAULT_FRONTEND_ORIGINS
        + env_list("CORS_ALLOWED_ORIGINS")
    )
)

CSRF_TRUSTED_ORIGINS = sorted(
    set(
        DEFAULT_FRONTEND_ORIGINS
        + env_list("CSRF_TRUSTED_ORIGINS")
        + (
            [f"https://{RENDER_EXTERNAL_HOSTNAME}"]
            if RENDER_EXTERNAL_HOSTNAME
            else []
        )
    )
)

CORS_ALLOW_CREDENTIALS = True


# -------------------------
# security
# -------------------------
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
