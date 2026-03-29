from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post, Comment, Hashtag, Media
from .serializers import PostSerializer, CommentSerializer, HashtagSerializer

@method_decorator(ensure_csrf_cookie, name="dispatch")
class PostViewSet(viewsets.ModelViewSet):
	queryset = Post.objects.select_related("user").all()
	serializer_class = PostSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]

	def perform_create(self, serializer):
		post = serializer.save(user=self.request.user)

		media_url = self.request.data.get("media_url")
		media_type = self.request.data.get("media_type") or "other"
		if media_url:
			Media.objects.create(
				post=post,
				url=media_url,
				media_type=media_type,
			)


class CommentViewSet(viewsets.ModelViewSet):
	queryset = Comment.objects.select_related("post", "user").all()
	serializer_class = CommentSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class HashtagViewSet(viewsets.ModelViewSet):
	queryset = Hashtag.objects.all()
	serializer_class = HashtagSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]
