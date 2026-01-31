# Flux 1.1 Pro Image Generator

Aplicación web de generación de imágenes de alta calidad utilizando el modelo Flux 1.1 Pro de Black Forest Labs a través de la API de Replicate.

## Arquitectura

La aplicación sigue una arquitectura cliente-servidor desacoplada para garantizar la seguridad de las credenciales y la escalabilidad.

- **Frontend (Cliente)**: Construido con React + Vite. Responsable de la interfaz de usuario, validación básica del prompt y visualización de resultados.
- **Backend (Servidor)**: Construido con Node.js + Express. Actúa como proxy seguro para interactuar con la API de Replicate, protegiendo el `REPLICATE_API_TOKEN`.

```mermaid
graph LR
    User[Usuario] -->|Prompt| Frontend[React App]
    Frontend -->|POST /generate| Backend[Node.js API]
    Backend -->|replicate.run()| Replicate[Replicate API]
    Replicate -->|flux-1.1-pro| AI[Modelo IA]
    AI -->|Imagen WebP| Replicate
    Replicate -->|URL| Backend
    Backend -->|JSON| Frontend
    Frontend -->|Display| User
```

## Requisitos Previos

- Node.js (v16 o superior)
- Una cuenta en Replicate y un API Token válido.

## Configuración e Instalación

### 1. Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Crea un archivo `.env` basado en `.env.example`.
   - Agrega tu token de Replicate:
     ```
     REPLICATE_API_TOKEN=r8_...tu_token_aqui...
     PORT=3000
     ```
4. Inicia el servidor:
   ```bash
   npm start
   # O para desarrollo:
   node server.js
   ```

### 2. Frontend

1. Navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la URL indicada (usualmente `http://localhost:5173`).

## Uso

1. Escribe un prompt detallado en el campo de texto.
2. Haz clic en **Generar Imagen**.
3. Espera unos segundos mientras Flux 1.1 Pro procesa la imagen.
4. Visualiza el resultado y descárgalo con el botón "Descargar WEBP".

## Buenas Prácticas Implementadas

- **Seguridad**: El Token de API nunca se expone al cliente (navegador).
- **Optimización**: Uso del formato `webp` para menor peso y carga rápida.
- **Costos**: El backend incluye validación básica para evitar llamadas vacías.
- **UX**: Feedback visual de carga y manejo de errores amigable.

## Despliegue (Opcional)

Si deseas desplegar en Railway u otro servicio:
1. Sube el contenido a un repositorio Git.
2. Configura el servicio para instalar dependencias y ejecutar `node server.js` en el Backend.
3. Configura la variable `REPLICATE_API_TOKEN` en el panel de control de tu proveedor de hosting.
