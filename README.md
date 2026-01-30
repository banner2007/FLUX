
# Flux 1.1 Pro - Image Generation Architecture

Esta aplicación utiliza una arquitectura desacoplada para garantizar la seguridad de las credenciales y la escalabilidad.

## 🏗 Arquitectura
1.  **Frontend (React/TypeScript)**: Interfaz de usuario intuitiva construida con Tailwind CSS. Captura los prompts y gestiona el estado de la generación.
2.  **Capa de Servicios**: Abstrae las llamadas HTTP al backend, manejando errores de red y parsing de datos.
3.  **Backend (Node.js)**: Actúa como proxy seguro entre el cliente y Replicate.com.
    *   **Seguridad**: El `REPLICATE_API_TOKEN` reside exclusivamente en el entorno del servidor.
    *   **Procesamiento**: Utiliza el SDK oficial de Replicate para interactuar con el modelo `black-forest-labs/flux-1.1-pro`.

## ⚙️ Configuración del Modelo
La aplicación está configurada siguiendo los requerimientos técnicos estrictos:
- **Aspect Ratio**: 1:1 (Cuadrado perfecto)
- **Formato**: WebP (Optimizado para web)
- **Calidad**: 80 (Equilibrio costo/detalle)
- **Seguridad**: Nivel 2 (Safety Tolerance)
- **Upsampling**: Habilitado para mejorar la interpretación del prompt.

## 🚀 Despliegue de Variables de Entorno
Asegúrate de configurar la siguiente variable en tu entorno de despliegue (Vercel/Railway/etc):
```bash
REPLICATE_API_TOKEN="tu_token_aqui"
```

## 🛠 Endpoint Utilizado
La aplicación consume el endpoint definido:
`https://backend-flux-1-1-git-main-carlos-projects-83e92bd9.vercel.app/`
