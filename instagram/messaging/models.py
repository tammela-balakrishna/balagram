from django.db import models
from django.contrib.auth.models import User


class Conversation(models.Model):

	created_at = models.DateTimeField(
		auto_now_add=True
	)


class Message(models.Model):

	conversation = models.ForeignKey(
		Conversation,
		on_delete=models.CASCADE
	)

	sender = models.ForeignKey(
		User,
		on_delete=models.CASCADE
	)

	text = models.TextField()

	created_at = models.DateTimeField(
		auto_now_add=True
	)
