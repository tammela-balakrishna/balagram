"""Add URL field to Media for Cloudinary support."""

from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("posts", "0001_initial"),
	]

	operations = [
		migrations.AlterField(
			model_name="media",
			name="file",
			field=models.FileField(upload_to="posts/", blank=True, null=True),
		),
		migrations.AddField(
			model_name="media",
			name="url",
			field=models.URLField(blank=True, null=True),
		),
	]
