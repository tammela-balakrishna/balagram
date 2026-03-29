"""Drop obsolete file field from Media model (URL-only storage)."""

from django.db import migrations


class Migration(migrations.Migration):

	dependencies = [
		("posts", "0002_media_url"),
	]

	operations = [
		migrations.RemoveField(
			model_name="media",
			name="file",
		),
	]
