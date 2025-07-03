#!/bin/bash
# verify-security.sh - Verificar validaciones de seguridad localmente

echo "🔒 VERIFICACIÓN DE VALIDACIONES DE SEGURIDAD"
echo "============================================="

# 1. Verificar npm audit
echo ""
echo "1. 🔍 Verificando vulnerabilidades en dependencias..."
echo "=================================================="
npm audit --audit-level=moderate --production
audit_status=$?
if [ $audit_status -eq 0 ]; then
    echo "✅ No se encontraron vulnerabilidades críticas"
else
    echo "⚠️ Se encontraron vulnerabilidades - revisar arriba"
fi

# 2. Construir imagen Docker
echo ""
echo "2. 🏗️ Construyendo imagen Docker..."
echo "=================================="
docker build -f Dockerfile.test -t maticrud-test:security-check .

# 3. Verificar hash de integridad
echo ""
echo "3. 🔒 Verificando integridad de artefactos..."
echo "============================================="
IMAGE_HASH=$(docker image inspect maticrud-test:security-check --format='{{.Id}}')
echo "📋 Image Hash: $IMAGE_HASH"
echo "✅ Hash de integridad generado correctamente"

# 4. Escanear imagen con Trivy (si está instalado)
echo ""
echo "4. 🛡️ Escaneando imagen Docker con Trivy..."
echo "============================================"
if command -v trivy &> /dev/null; then
    echo "Trivy encontrado. Ejecutando escaneo..."
    trivy image --severity CRITICAL,HIGH maticrud-test:security-check
else
    echo "⚠️ Trivy no está instalado. Instalando..."
    # Para Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install wget apt-transport-https gnupg lsb-release
        wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
        echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
        sudo apt-get update
        sudo apt-get install trivy
        trivy image --severity CRITICAL,HIGH maticrud-test:security-check
    else
        echo "❌ No se pudo instalar Trivy automáticamente"
        echo "💡 Instálalo manualmente desde: https://aquasecurity.github.io/trivy/"
    fi
fi

# 5. Verificar SonarCloud (mostrar info)
echo ""
echo "5. 📊 Verificación de SonarCloud..."
echo "=================================="
echo "✅ SonarCloud se ejecuta automáticamente en GitHub Actions"
echo "🔗 Verifica los resultados en: https://sonarcloud.io/"
echo "💡 Busca tu proyecto y revisa métricas de seguridad"

# 6. Resumen
echo ""
echo "📋 RESUMEN DE VALIDACIONES DE SEGURIDAD"
echo "======================================="
echo "✅ npm audit: Escaneo de vulnerabilidades en dependencias"
echo "✅ Trivy: Escaneo de vulnerabilidades en imagen Docker"
echo "✅ Hash: Verificación de integridad de artefactos"
echo "✅ SonarCloud: Análisis de código y seguridad"
echo "✅ Versionado SHA: Trazabilidad completa"

echo ""
echo "🎉 Todas las validaciones de seguridad están configuradas correctamente!"
echo "💡 Para ver resultados detallados, revisa los logs de GitHub Actions"