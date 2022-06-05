from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import NoteSerializer
from home.models import Note

# Create your views here.

@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'route': '/api/get_notes/',
            'description': 'Get all the not objects.'
        },
        {
            'route': '/api/get_note/:note_uuid/',
            'description': 'Get the note related to the note_uuid passed into the url.'
        },
        {
            'route': '/aoi/add_note/',
            'description': 'It will add a note to the database'
        },
        {
            'route': '/api/update_note/',
            'description': 'It will update a single note in the database'
        },
        {
            'route': '/api/delete_note/',
            'description': 'It will delete a single note from the database'
        }
    ]
    return Response({'routes': routes})

@api_view(['GET'])
def get_notes(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    return Response({'notes': serializer.data})

@api_view(['GET'])
def get_note(request, note_uuid):
    note = Note.objects.filter(note_uuid=note_uuid).first()
    serializer = NoteSerializer(note, many=False)
    return Response({'note': serializer.data})

def add_note(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")

        if not title or not description:
            return JsonResponse({"message": "Title or description cannot be blank!", "status": "error"})
        
        elif len(title) < 5 or len(description) < 5:
            return JsonResponse({"message": "Title or description cannot be under 5 characters!", "status": "error"})

        else:
            note = Note(title=title, description=description)
            note.save()
            return JsonResponse({"message": "Your note has been added successfully!", "status": "success"})

    else:
        return JsonResponse({"BadRequest": {"status": 400, "requestType": request.method}, "message": "{} method is not allowed on this url!".format(request.method)})

def update_note(request):
    if request.method == "POST":
        note_uuid = request.POST.get("note_uuid")
        title = request.POST.get("title")
        description = request.POST.get("description")

        if not title or not description:
            return JsonResponse({"message": "Title or description cannot be blank!", "status": "error"})
        
        elif len(title) < 5 or len(description) < 5:
            return JsonResponse({"message": "Title or description cannot be under 5 characters!", "status": "error"})

        else:
            note = Note.objects.filter(note_uuid=note_uuid).first()
            note.title = title
            note.description = description
            note.save()
            return JsonResponse({"message": "Your note has been updated successfully!", "status": "success"})

    else:
        return JsonResponse({"BadRequest": {"status": 400, "requestType": request.method}, "message": "{} method is not allowed on this url!".format(request.method)})

def delete_note(request):
    if request.method == "POST":
        note_uuid = request.POST.get("note_uuid")
        note = Note.objects.filter(note_uuid=note_uuid).first()
        note.delete()
        return JsonResponse({"message": "Your note has been deleted successfully!", "status": "success"})

    else:
        return JsonResponse({"BadRequest": {"status": 400, "requestType": request.method}, "message": "{} method is not allowed on this url!".format(request.method)})