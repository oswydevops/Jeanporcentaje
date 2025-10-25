FROM python:3.9-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    build-base \
    linux-headers \
    pkgconfig \
    libffi-dev \
    openssl-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar aplicación
COPY . .

# Crear usuario no-root para mayor seguridad
RUN adduser -D -s /bin/sh appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Usar gunicorn para producción
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "300", "app:app"]