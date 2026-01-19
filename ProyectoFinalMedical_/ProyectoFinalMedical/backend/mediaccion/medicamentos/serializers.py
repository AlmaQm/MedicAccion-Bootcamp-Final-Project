from rest_framework import serializers
from .models import ProfileUser, Notificaciones, RecetasMedicas, Alimentos, Medicamentos, MedicamentosProgramados, Sexoedad, MedicamentosMasRegistrados, BusquedasChat
from django.contrib.auth.models import User

#Serializer ProfileUser y campos User en una sola
class ProfileUserSerializer(serializers.ModelSerializer):
    id_user = serializers.IntegerField(source='user.id')
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = ProfileUser
        fields = ['id_user', 'username', 'first_name', 'last_name', 'email', 'id', 'date_birth', 'roles', 'genero', 'pais', 'telefono']
#Al haber datos anidados DRF necesita saber que datos actualizar
    def update(self, instance, validated_data):
        # separar los datos que pertenecen al user
        user_data = validated_data.pop("user", {})
        # actualizar los campos del profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # actualizar los campos del user
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        return instance
    
#Serializer anidado
class ProfileRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileUser
        exclude = ['user']  

class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileRegisterSerializer()

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'profile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        ProfileUser.objects.create(user=user, **profile_data)
        return user

class NotificacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificaciones
        fields = '__all__'

class RecetasMedicasSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetasMedicas
        fields = '__all__'

class AlimentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimentos
        fields = '__all__'

class MedicamentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicamentos
        fields = '__all__'

class MedicamentosProgramadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicamentosProgramados
        fields = '__all__'

class SexoedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sexoedad
        exclude = '__all__'

class MedicamentosMasRegistradosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileUser
        exclude = '__all__'

class BusquedasChatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusquedasChat
        exclude = '__all__'