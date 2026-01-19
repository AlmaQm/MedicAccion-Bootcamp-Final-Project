from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UsersViews),
    path('users/crear/', views.CrearUser),
    path('users/profile/me/', views.ProfileView),

    path('notificaciones/', views.NotificacionesView),
    path('notificaciones/<int:pk>/', views.NotificacionesDetailView),

    path('recetasmedicas/', views.RecetasMedicasView),
    path('recetasmedicas/<int:pk>/', views.RecetasMedicasDetailView),

    path('alimentos/profile/me', views.AlimentosView),
    path('alimentos/profile/me/<int:pk>/', views.AlimentosDetailView),

    path('medicamentos/', views.MedicamentosView),
    path('medicamentos/<int:pk>/', views.MedicamentosDetailView),
    
    path('medicamentos-programados/', views.MedicamentosProgramadosView),
    path('medicamentos-programados/<int:pk>/', views.MedicamentosProgramadosDetailView),

    path('api/meds_programados/', views.MedicamentosProgramadosList),

    path('notificaciones/whats/', views.test_whatsapp, name='test_whatsapp'),



    path('sexoedad/', views.SexoedadView),

    path('medicamentos-mas-registrados/', views.MedicamentosMasRegistradosView),

    path('busquedas-chat/', views.BusquedasChatView),
]