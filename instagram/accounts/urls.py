from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CsrfView, LoginView, ProfileViewSet, RegistrationView


router = DefaultRouter()
router.register(r"profiles", ProfileViewSet, basename="profile")


urlpatterns = [
    path("", include(router.urls)),
    path("csrf/", CsrfView.as_view(), name="account-csrf"),
    path("register/", RegistrationView.as_view(), name="account-register"),
    path("login/", LoginView.as_view(), name="account-login"),
]
