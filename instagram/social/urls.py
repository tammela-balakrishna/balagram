from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PostLikeViewSet, FollowViewSet, StoryViewSet, NotificationViewSet


router = DefaultRouter()
router.register(r"likes", PostLikeViewSet, basename="postlike")
router.register(r"follows", FollowViewSet, basename="follow")
router.register(r"stories", StoryViewSet, basename="story")
router.register(r"notifications", NotificationViewSet, basename="notification")


urlpatterns = [
    path("", include(router.urls)),
]