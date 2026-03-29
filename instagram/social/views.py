from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import PostLike, Follow, Story, Notification
from .serializers import (
	PostLikeSerializer,
	FollowSerializer,
	StorySerializer,
	NotificationSerializer,
)


class PostLikeViewSet(viewsets.ModelViewSet):
	queryset = PostLike.objects.select_related("user", "post").all()
	serializer_class = PostLikeSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]


class FollowViewSet(viewsets.ModelViewSet):
	queryset = Follow.objects.select_related("follower", "following").all()
	serializer_class = FollowSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]


class StoryViewSet(viewsets.ModelViewSet):
	queryset = Story.objects.select_related("user").all()
	serializer_class = StorySerializer
	permission_classes = [IsAuthenticatedOrReadOnly]


class NotificationViewSet(viewsets.ModelViewSet):
	queryset = Notification.objects.select_related("user").all()
	serializer_class = NotificationSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]
