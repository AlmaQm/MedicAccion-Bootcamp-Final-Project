from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import ProfileUser, Notificaciones, RecetasMedicas, Alimentos, Medicamentos, MedicamentosProgramados, Sexoedad, MedicamentosMasRegistrados, BusquedasChat
from .serializers import ProfileUserSerializer, NotificacionesSerializer, RecetasMedicasSerializer, AlimentosSerializer, MedicamentosSerializer, RegisterSerializer, MedicamentosProgramadosSerializer, SexoedadSerializer, MedicamentosMasRegistradosSerializer, BusquedasChatsSerializer  
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.conf import settings
from twilio.rest import Client
import logging


#Solo permitimos a no usuarios registrados crearse la cuenta
#CRUD Usuarios  
@api_view(['POST'])
@permission_classes([AllowAny])
def CrearUser(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario creado"}, status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UsersViews(request):
    if request.method == 'GET':
        perfiles = ProfileUser.objects.select_related('user').all()
        serializer = ProfileUserSerializer(perfiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def ProfileView(request):
    user = request.user
    print(user)
    #Validaciones buenas practicas
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProfileUserSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = ProfileUserSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario actualizado"}, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    #Al estar autenticado con JWT sigue existiendo el token pero al intentar acceder dara un 401
    if request.method == 'DELETE':
        user.delete()
        return Response({"message": "Usuario eliminado"}, status=status.HTTP_204_NO_CONTENT)
        
# CRUD Notificaciones
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def NotificacionesView(request):
    user = request.user
    #Validaciones buenas practicas
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    #Obtiene todas las notificaciones del usuario
    try:
        notificaciones = Notificaciones.objects.filter(user=profile)
    except Notificaciones.DoesNotExist:
        return Response({"error": "Notificación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    #el profile=profile hace que asigne este profile si o si si tiene el campo user obligatorio
    if request.method == 'GET':
        serializer = NotificacionesSerializer(notificaciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = NotificacionesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile)
            return Response({"message": "Notificación creada"}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def NotificacionesDetailView(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        notificaciones = Notificaciones.objects.get(pk=pk, user=profile)
    except Notificaciones.DoesNotExist:
        return Response({"error": "Notificación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = NotificacionesSerializer(notificaciones)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = NotificacionesSerializer(notificaciones, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        notificaciones.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#CRUD Recetas Medicas
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def RecetasMedicasView(request):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    #Obtiene todas las recetas del usuario
    try:
        recetas = RecetasMedicas.objects.filter(user=profile)
    except RecetasMedicas.DoesNotExist:
        return Response({"error": "Recetas no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RecetasMedicasSerializer(recetas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = RecetasMedicasSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile)
            return Response({"message": "Receta medica creada"}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def RecetasMedicasDetailView(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        receta = RecetasMedicas.objects.get(pk=pk, user=profile)
    except RecetasMedicas.DoesNotExist:
        return Response({"error": "Receta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RecetasMedicasSerializer(receta)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = RecetasMedicasSerializer(receta, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        receta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#CRUD Alimentos
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def AlimentosView(request):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    #Obtiene todos los alimnentos del usuario
    try:
        alimentos = Alimentos.objects.filter(profile=profile)
    except Alimentos.DoesNotExist:
        return Response({"error": "Alimentos no encontrados"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AlimentosSerializer(alimentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = AlimentosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response({"message": "Alimento creada"}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def AlimentosDetailView(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        alimentos = Alimentos.objects.get(pk=pk, profile=profile)
    except Alimentos.DoesNotExist:
        return Response({"error": "Alimento no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AlimentosSerializer(alimentos)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = AlimentosSerializer(alimentos, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        alimentos.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#CRUD Medicamentos
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def MedicamentosView(request):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    #Obtiene todos los medicamentos del usuario
    try:
        medicamentos = Medicamentos.objects.filter(user=profile)
    except Medicamentos.DoesNotExist:
        return Response({"error": "Medicamentos no encontrados"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MedicamentosSerializer(medicamentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = MedicamentosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile)
            return Response({"message": "Medicamento creada"}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def MedicamentosDetailView(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        medicamentos = Medicamentos.objects.get(pk=pk, user=profile)
    except Medicamentos.DoesNotExist:
        return Response({"error": "Medicamento no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MedicamentosSerializer(medicamentos)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = MedicamentosSerializer(medicamentos, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        medicamentos.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CRUD Medicamentos Programados
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def MedicamentosProgramadosView(request):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        medicamentos = MedicamentosProgramados.objects.filter(user=profile)
        serializer = MedicamentosProgramadosSerializer(medicamentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = MedicamentosProgramadosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def MedicamentosProgramadosDetailView(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        medicamento = MedicamentosProgramados.objects.get(pk=pk, user=profile)
    except MedicamentosProgramados.DoesNotExist:
        return Response({"error": "Medicamento programado no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MedicamentosProgramadosSerializer(medicamento)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = MedicamentosProgramadosSerializer(medicamento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        medicamento.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def MedicamentosProgramadosList(request, pk):
    user = request.user
    if user.is_anonymous:
        return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

    # Obtenemos el perfil del usuario
    try:
        profile = user.profile
    except ProfileUser.DoesNotExist:
        return Response({"error": "El perfil no existe"}, status=status.HTTP_404_NOT_FOUND)

    # Buscamos el medicamento programado con pk y del usuario
    try:
        medicamento = MedicamentosProgramados.objects.get(pk=pk, user=profile)
    except MedicamentosProgramados.DoesNotExist:
        return Response({"error": "Medicamento programado no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    # ===================== GET =====================
    if request.method == 'GET':
        serializer = MedicamentosProgramadosSerializer(medicamento)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ===================== PUT =====================
    if request.method == 'PUT':
        # Actualizamos campos de medicamento, parcial=True permite actualizar solo algunos campos
        serializer = MedicamentosProgramadosSerializer(medicamento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ===================== DELETE =====================
    if request.method == 'DELETE':
        medicamento.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    

#============ TEST CONEXIÓN WHATSAPP =============
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_whatsapp(request):
    try:
        user = request.user
        # Obtener el perfil del usuario
        try:
            profile = user.profile
        except ProfileUser.DoesNotExist:
            return Response(
                {"error": "El perfil no existe"},
                status=404
            )
        
        # Obtener teléfono del perfil
        telefono_completo = request.data.get('telefonoCompleto')
        
        # Si no viene en el body, construirlo desde el perfil
        if not telefono_completo:
            if not profile.telefono or not profile.pais:
                return Response(
                    {"error": "No tienes un número de teléfono guardado"},
                    status=400
                )
            telefono_completo = f"{profile.pais}{profile.telefono}"

        # Mensaje personalizado o por defecto
        mensaje_personalizado = request.data.get(
            "mensaje",
            "🔔 MediAcción\n\nRecordatorio de medicación."
        )

        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

        mensaje = client.messages.create(
            from_='whatsapp:+14155238886',
            body=mensaje_personalizado,
            to=f'whatsapp:{telefono_completo}'
        )

        return Response({
            "success": True,
            "message_sid": mensaje.sid,
            "telefono_usado": telefono_completo,
            "status": mensaje.status,
        }, status=200)

    except Exception as e:
        logger.error(f"[TWILIO ERROR] {str(e)}")
        return Response({
            "success": False,
            "error": str(e)
        }, status=500)

#============ MODELOS GRAFICOS ============
@api_view(['GET', 'POST'])
def SexoedadView(request):
    if request.method == 'GET':
        sexoedad = Sexoedad.objects.all()
        serializer = SexoedadSerializer(sexoedad, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = SexoedadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Perfil guardado para vender datos😈'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def MedicamentosMasRegistradosView(request):
    if request.method == 'GET':
        meds_mas_registrados = MedicamentosMasRegistrados.objects.all()
        serializer = MedicamentosMasRegistradosSerializer(meds_mas_registrados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = MedicamentosMasRegistradosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Medicamento guardado para vender datos😈 '}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def BusquedasChatView(request):
    if request.method == 'GET':
        busquedas_chat = BusquedasChat.objects.all()
        serializer = BusquedasChatsSerializer(busquedas_chat, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    if request.method == 'POST':
        serializer = BusquedasChatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Búsqueda guardada para vender datos😈'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)