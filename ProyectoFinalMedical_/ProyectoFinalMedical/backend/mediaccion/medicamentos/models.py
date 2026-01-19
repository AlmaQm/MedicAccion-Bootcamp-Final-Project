from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ProfileUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='profile')
    date_birth = models.DateField(null=True, blank=True)
    ROLES = [
        ("admin", "Administrador"),
        ("user", "Ususario"),
        ("premium", "Usuario Premium"),
        ("usuario_secundario", "Usuario Secundario"),
    ]
    roles = models.CharField(max_length=20, choices=ROLES, default='user')

    GENEROS = [
        ('hombre', 'Hombre'),
        ('mujer', 'Mujer'),
        ('otro', 'Otro')
    ]
    genero = models.CharField(max_length=20, choices=GENEROS, default='otro')
    pais = models.CharField(max_length=5, null=True)
    telefono = models.CharField(max_length=16, null=True)

    def __str__(self):
        return self.user.username

class Notificaciones(models.Model):
    notificacion = models.CharField(max_length=50)
    user = models.ForeignKey(ProfileUser, on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')

    def __str__(self):
        return self.notificacion

class RecetasMedicas(models.Model):
    recetas_medicas = models.CharField(max_length=100)
    user = models.ForeignKey(ProfileUser, on_delete=models.CASCADE, null=True, blank=True, related_name = 'recetasmedicas')

    def __str__(self):
        return self.recetas_medicas

class Alimentos(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Medicamentos(models.Model):
    medicamento = models.CharField(max_length=100)
    descripcion = models.TextField()
    user = models.ForeignKey(ProfileUser, on_delete=models.CASCADE, null=True, blank=True, related_name = 'medicamentos')

    def __str__(self):
        return self.medicamento

class MedicamentosProgramados(models.Model):
    nombre = models.CharField(max_length=100)
    intervalo = models.IntegerField(default=8)  # Intervalo en horas
    tomadas = models.IntegerField(default=0)
    total_tomas = models.IntegerField(default=3)
    fecha = models.DateField()
    ultima_toma = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(ProfileUser, on_delete=models.CASCADE, null=True, blank=True, related_name='medicamentos_programados')
    
    class Meta:
        unique_together = ('nombre', 'fecha', 'user')
    
    def __str__(self):
        return f"{self.nombre} - {self.fecha}"



class Sexoedad(models.Model):
    edad = models.IntegerField()
    SEXO_CHOICES = [
        ("M", "Hombre"),
        ("F", "Mujer"),
        ("O", "Otro"),
    ]
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    def __str__(self):
        return f"{self.edad} - {self.sexo}"

class MedicamentosMasRegistrados(models.Model):
    medicamento = models.CharField(max_length=100)
    edad = models.ForeignKey(Sexoedad, on_delete=models.CASCADE, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.medicamento

class BusquedasChat(models.Model):
    termino_busqueda = models.CharField(max_length=100)
    edad = models.ForeignKey(Sexoedad, on_delete=models.CASCADE, null=True)
    fecha_busqueda = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.termino_busqueda