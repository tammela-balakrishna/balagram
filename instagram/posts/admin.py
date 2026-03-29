from django.contrib import admin

from .models import Post, Media, Comment, Hashtag, PostHashtag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "created_at", "is_reel")
	search_fields = ("user__username", "caption")
	list_filter = ("is_reel", "created_at")


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
	list_display = ("id", "post", "media_type")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
	list_display = ("id", "post", "user", "created_at")
	search_fields = ("user__username", "text")


@admin.register(Hashtag)
class HashtagAdmin(admin.ModelAdmin):
	list_display = ("id", "name")
	search_fields = ("name",)


@admin.register(PostHashtag)
class PostHashtagAdmin(admin.ModelAdmin):
	list_display = ("id", "post", "hashtag")
