# Generated migration for MedicamentosProgramados model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('medicamentos', '0006_medicamentos_user_alter_medicamentos_alimento'),
    ]

    operations = [
        migrations.CreateModel(
            name='MedicamentosProgramados',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('intervalo', models.IntegerField(default=8)),
                ('fecha', models.DateField()),
                ('ultima_toma', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='medicamentos_programados', to='medicamentos.profileuser')),
            ],
        ),
        migrations.AddConstraint(
            model_name='medicamentosprogramados',
            constraint=models.UniqueConstraint(fields=('nombre', 'fecha', 'user'), name='unique_med_fecha_user'),
        ),
    ]
