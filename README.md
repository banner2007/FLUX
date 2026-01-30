
# Flux 1.1 Pro - Image Generation Architecture (Railway Edition)

Esta aplicación utiliza una arquitectura profesional para la generación de imágenes de alta calidad con el modelo Flux 1.1 Pro.

## 🏗 Arquitectura
1.  **Frontend (React/TypeScript)**: Interfaz de usuario "Studio" construida con Tailwind CSS.
2.  **Backend (Node.js en Railway)**: Actúa como proxy seguro para proteger las credenciales de Replicate.
    *   **Seguridad**: El `REPLICATE_API_TOKEN` se gestiona como variable de entorno en Railway.
    *   **Modelo**: EXCLUSIVAMENTE `black-forest-labs/flux-1.1-pro` vía Replicate SDK.

## ⚙️ Configuración del Modelo (Estricta)
- **Prompt**: Dinámico del usuario.
- **Aspect Ratio**: 1:1.
- **Formato**: WebP (Optimizado).
- **Calidad**: 80.
- **Seguridad**: Nivel 2.
- **Upsampling**: Habilitado.

## 🚀 Despliegue en Railway
Asegúrate de configurar:
```bash
REPLICATE_API_TOKEN="tu_token_de_replicate"
```

## 🛠 Endpoint Actualizado
`https://flux-production-593a.up.railway.app/api/generate`
