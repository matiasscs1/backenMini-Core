## comnpilar el entonro de pruebas
-  chmod +x deploy-test.sh
- ./deploy-test.sh
## comprobar seguridad escaneo de trivy, sonarcloud 
Escaneo de Vulnerabilidades:
- chmod +x verify-security.sh
- ./verify-security.sh


- ✅ SonarCloud (ya lo tienes) - Análisis de código
- ✅ npm audit - Vulnerabilidades en dependencias
- ✅ Trivy - Vulnerabilidades en imagen Docker

Integridad de Artefactos:

- ✅ Hash de imagen Docker - Verificación de integridad
- ✅ Versionado con SHA - Trazabilidad completa
## 🔍 Cómo verificar cada validación:
- 1. Verificar SonarCloud (ya lo tienes)
- En GitHub Actions:

- Ve a tu pipeline exitoso
- Haz clic en "Build and analyze"
- Deberías ver: "SonarCloud Scan" ✅

- En SonarCloud:

- Ve a sonarcloud.io
- Busca tu proyecto
- Verás métricas de seguridad, bugs, code smells

- 2. Verificar npm audit
- En GitHub Actions:

- Haz clic en "Build and analyze"
- Busca el paso "Security Vulnerability Scan"

## produccion 

- chmod +x deploy-production.sh
- ./deploy-production.sh
- docker-compose -f docker-compose.prod.yml down

