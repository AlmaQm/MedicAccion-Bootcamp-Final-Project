#!/usr/bin/env sh

set -e

echo "Recopilando archivos estáticos..."
python manage.py collectstatic --noinput --clear

echo "Ejecutando migraciones de base de datos..."
python manage.py migrate --noinput

echo "Iniciando Gunicorn..."
exec gunicorn mediaccion.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 3 \
    --threads 2 \
    --worker-class gthread \
    --access-logfile - \
    --error-logfile -