from rest_framework.serializers import ModelSerializer
from home.models import Note

class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = ['title', 'description', 'note_uuid', 'created']