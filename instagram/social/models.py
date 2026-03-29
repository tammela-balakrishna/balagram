from django.db import models
from django.contrib.auth.models import User
from posts.models import Post


class PostLike(models.Model):

	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	post = models.ForeignKey(
		Post,
		on_delete=models.CASCADE
	)

	created_at = models.DateTimeField(
		auto_now_add=True
	)


class Follow(models.Model):

	follower = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name="following"
	)

	following = models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		related_name="followers"
	)

	created_at = models.DateTimeField(
		auto_now_add=True
	)


class Story(models.Model):

	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	media_file = models.FileField(
		upload_to="stories/"
	)

	created_at = models.DateTimeField(
		auto_now_add=True
	)


class Notification(models.Model):

	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	message = models.CharField(
		max_length=255
	)

	is_read = models.BooleanField(default=False)

	created_at = models.DateTimeField(
		auto_now_add=True
	)
