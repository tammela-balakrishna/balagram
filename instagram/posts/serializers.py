from rest_framework import serializers

from .models import Post, Media, Comment, Hashtag


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "post", "url", "media_type"]


class PostSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    media_set = MediaSerializer(source="media_set.all", many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "user_username",
            "caption",
            "created_at",
            "is_reel",
            "media_set",
        ]
        extra_kwargs = {"user": {"read_only": True}}


class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "user",
            "user_username",
            "text",
            "created_at",
        ]
        extra_kwargs = {"user": {"read_only": True}}


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ["id", "name"]
