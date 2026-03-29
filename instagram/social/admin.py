from django.contrib import admin

from .models import PostLike, Follow, Story, Notification


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "post", "created_at")
	search_fields = ("user__username", "post__caption")


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
	list_display = ("id", "follower", "following", "created_at")
	search_fields = ("follower__username", "following__username")


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "created_at")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "message", "is_read", "created_at")
	list_filter = ("is_read", "created_at")
