from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes, name='get_routes'),
    path('get_notes/', views.get_notes, name='get_notes'),
    path('get_note/<str:note_uuid>/', views.get_note, name='get_note'),
    path('add_note/', views.add_note, name='add_note'),
    path('update_note/', views.update_note, name='update_note'),
    path('delete_note/', views.delete_note, name='delete_note')
]
