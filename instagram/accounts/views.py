from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import ProfileSerializer, RegistrationSerializer


class ProfileViewSet(viewsets.ModelViewSet):
	queryset = Profile.objects.select_related("user").all()
	serializer_class = ProfileSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]


@method_decorator(csrf_protect, name="dispatch")
class RegistrationView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		serializer = RegistrationSerializer(data=request.data)
		if serializer.is_valid():
			profile = serializer.save()
			data = ProfileSerializer(profile, context={"request": request}).data
			return Response(data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, *args, **kwargs):
		return Response({"detail": "CSRF cookie set"})


@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		username = request.data.get("username")
		password = request.data.get("password")

		if not username or not password:
			return Response(
				{"detail": "username and password are required"},
				status=status.HTTP_400_BAD_REQUEST,
			)

		user = authenticate(request, username=username, password=password)
		if user is None:
			return Response(
				{"detail": "Invalid credentials"},
				status=status.HTTP_400_BAD_REQUEST,
			)

		login(request, user)

		profile = getattr(user, "profile", None)
		profile_data = (
			ProfileSerializer(profile, context={"request": request}).data
			if profile
			else None
		)

		return Response(
			{
				"id": user.id,
				"username": user.username,
				"email": user.email,
				"profile": profile_data,
			}
		)
