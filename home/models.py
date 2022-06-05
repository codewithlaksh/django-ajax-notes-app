from django.db import models
import uuid

# Create your models here.
class Note(models.Model):
    sno = models.AutoField(primary_key=True)
    title = models.CharField(max_length=800)
    note_uuid = models.UUIDField(default=uuid.uuid4)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)