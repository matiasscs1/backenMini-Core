#!/bin/bash
# deploy-test.sh

echo "🚀 Desplegando maticrud en entorno de pruebas..."

# Detener contenedores existentes
echo "⏹️  Deteniendo contenedores existentes..."
docker-compose -f docker-compose.test.yml down

# Construir nueva imagen
echo "🏗️  Construyendo nueva imagen..."
docker build -f Dockerfile.test -t maticrud-test .

# Levantar servicios
echo "🚀 Levantando servicios..."
docker-compose -f docker-compose.test.yml up -d

# Esperar a que la aplicación esté lista
echo "⏳ Esperando a que la aplicación esté lista..."
sleep 15

# Verificar que está funcionando
echo "🔍 Verificando el estado de la aplicación..."
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Aplicación desplegada exitosamente!"
    echo "🌐 Accede a: http://localhost:3001"
    echo "🗄️  MongoDB Test: mongodb://localhost:27018/MiniCore_test"
else
    echo "❌ Error en el despliegue. Revisando logs..."
    docker-compose -f docker-compose.test.yml logs maticrud-test
    exit 1
fi

echo "📊 Para ver los logs en tiempo real:"
echo "docker-compose -f docker-compose.test.yml logs -f maticrud-test"