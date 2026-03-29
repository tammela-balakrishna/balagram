from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


class ConversationViewSet(viewsets.ModelViewSet):
	queryset = Conversation.objects.all()
	serializer_class = ConversationSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]


class MessageViewSet(viewsets.ModelViewSet):
	queryset = Message.objects.select_related("conversation", "sender").all()
	serializer_class = MessageSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]

	def perform_create(self, serializer):
		serializer.save(sender=self.request.user)
