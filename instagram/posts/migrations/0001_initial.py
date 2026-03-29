"""Initial migration for posts app (recreated)."""

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

	initial = True

	dependencies = [
		migrations.swappable_dependency(settings.AUTH_USER_MODEL),
	]

	operations = [
		migrations.CreateModel(
			name="Post",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("caption", models.TextField()),
				("created_at", models.DateTimeField(auto_now_add=True)),
				("is_reel", models.BooleanField(default=False)),
				("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
			],
		),
		migrations.CreateModel(
			name="Hashtag",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("name", models.CharField(max_length=100)),
			],
		),
		migrations.CreateModel(
			name="Media",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("file", models.FileField(upload_to="posts/")),
				("media_type", models.CharField(max_length=10)),
				("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posts.post")),
			],
		),
		migrations.CreateModel(
			name="Comment",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("text", models.TextField()),
				("created_at", models.DateTimeField(auto_now_add=True)),
				("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posts.post")),
				("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
			],
		),
		migrations.CreateModel(
			name="PostHashtag",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("hashtag", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posts.hashtag")),
				("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="posts.post")),
			],
		),
	]
