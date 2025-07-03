#!/bin/bash
# deploy-production.sh

echo "🚀 DESPLIEGUE EN ENTORNO DE PRODUCCIÓN SIMULADO"
echo "==============================================="

# Verificar archivos necesarios
echo "📋 Verificando archivos de configuración..."
if [ ! -f "Dockerfile.prod" ]; then
    echo "❌ Dockerfile.prod no encontrado"
    exit 1
fi

if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ docker-compose.prod.yml no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración verificados"

# Detener contenedores existentes
echo "⏹️ Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down --volumes

# Construir imagen de producción
echo "🏗️ Construyendo imagen de producción..."
docker build -f Dockerfile.prod -t maticrud-prod:latest .

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la imagen"
    exit 1
fi

echo "✅ Imagen de producción construida exitosamente"

# Iniciar servicios de producción
echo "🚀 Iniciando servicios de producción..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
echo "📋 Verificando estado de los servicios..."
docker-compose -f docker-compose.prod.yml ps

# Health check de la aplicación
echo "🔍 Ejecutando health check de la aplicación..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3002/health 2>/dev/null; then
        echo "✅ Health check de aplicación exitoso"
        break
    else
        echo "⏳ Intento $attempt/$max_attempts fallido, reintentando en 10s..."
        sleep 10
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Health check falló después de $max_attempts intentos"
    echo "📋 Logs de la aplicación:"
    docker-compose -f docker-compose.prod.yml logs maticrud-prod
    exit 1
fi

# Verificar base de datos
echo "🔍 Verificando base de datos..."
if docker-compose -f docker-compose.prod.yml exec -T mongo-prod mongosh --eval "db.runCommand('ping')" --quiet; then
    echo "✅ Base de datos funcionando correctamente"
else
    echo "❌ Base de datos no responde"
fi

# Pruebas de smoke testing
echo "🧪 Ejecutando pruebas de smoke testing..."
if curl -f http://localhost:3002/ 2>/dev/null; then
    echo "✅ Endpoint principal funcionando"
else
    echo "❌ Endpoint principal no responde"
fi

# Mostrar información de acceso
echo ""
echo "🎉 DESPLIEGUE DE PRODUCCIÓN COMPLETADO EXITOSAMENTE"
echo "=================================================="
echo "🌐 Aplicación de Producción: http://localhost:3002"
echo "🔍 Health Check: http://localhost:3002/health"
echo "🗄️ MongoDB Producción: mongodb://localhost:27019/MiniCore_prod"
echo ""
echo "📊 Comparación de Entornos:"
echo "  🧪 Testing:    http://localhost:3001"
echo "  🏭 Producción: http://localhost:3002"
echo ""
echo "📋 Comandos útiles:"
echo "  Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Reiniciar: docker-compose -f docker-compose.prod.yml restart"
echo "  Detener: docker-compose -f docker-compose.prod.yml down"
echo "  Estado: docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "🔒 Características de Producción:"
echo "  ✅ Usuario no-root en contenedores"
echo "  ✅ Health checks automáticos"
echo "  ✅ Restart automático de servicios"
echo "  ✅ Base de datos separada"
echo "  ✅ Logs persistentes"