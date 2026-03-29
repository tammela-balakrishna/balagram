from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):

	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	caption = models.TextField()

	created_at = models.DateTimeField(
		auto_now_add=True
	)

	is_reel = models.BooleanField(default=False)

	def __str__(self):

		return self.caption[:20]


class Media(models.Model):

	post = models.ForeignKey(
		Post,
		on_delete=models.CASCADE
	)

	url = models.URLField(
		blank=True,
		null=True,
	)

	media_type = models.CharField(
		max_length=10
	)


class Comment(models.Model):

	post = models.ForeignKey(
		Post,
		on_delete=models.CASCADE
	)

	user = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	text = models.TextField()

	created_at = models.DateTimeField(
		auto_now_add=True
	)


class Hashtag(models.Model):

	name = models.CharField(max_length=100)


class PostHashtag(models.Model):

	post = models.ForeignKey(
		Post,
		on_delete=models.CASCADE
	)

	hashtag = models.ForeignKey(
		Hashtag,
		on_delete=models.CASCADE
	)
