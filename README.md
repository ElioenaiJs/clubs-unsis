# Clubs UNSIS

Este proyecto utiliza **React**, **Vite**, **Firebase Firestore** y **Material-UI** para crear una aplicación moderna y eficiente.

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de desarrollo rápida para proyectos web.
- **Firebase Firestore**: Base de datos en tiempo real para almacenamiento y sincronización.
- **Material-UI**: Librería de componentes de interfaz de usuario.

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/clubs-unsis.git
cd clubs-unsis
```

### 2. Instalar dependencias

Asegúrate de tener **Node.js** instalado. Luego, ejecuta:

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita Firestore en modo de prueba.
3. Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Iniciar el servidor de desarrollo

Ejecuta el siguiente comando para iniciar el servidor:

```bash
npm run dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173) para ver la aplicación.

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera una versión optimizada para producción.
- `npm run preview`: Previsualiza la aplicación en modo producción.
