# Gestor Estratégico de Tareas

Aplicación web SPA para la gestión de tareas personales, desarrollada como Proyecto Integrador 4 de MateCode.

La aplicación permite registrar usuarios, iniciar sesión y gestionar tareas de forma privada. Cada usuario puede crear, visualizar, editar, completar y eliminar sus propias tareas. También puede recibir por email un resumen de sus tareas mediante una integración con AWS SES.

## Funcionalidades

- Registro de usuarios con email y contraseña.
- Inicio y cierre de sesión.
- Persistencia de la sesión.
- Rutas privadas protegidas.
- Creación de tareas.
- Visualización de tareas por usuario.
- Edición de tareas.
- Eliminación de tareas.
- Cambio de estado entre pendiente y completada.
- Actualización de tareas en tiempo real con Firestore.
- Estados de carga y manejo de errores.
- Envío por email de un resumen de tareas.
- Interfaz responsive.
- Tests de componentes con Vitest y React Testing Library.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- CSS

### Backend y servicios

- Firebase Authentication
- Cloud Firestore
- AWS Simple Email Service (SES)
- Vercel Functions

### Testing

- Vitest
- React Testing Library
- jest-dom
- jsdom

## Arquitectura

El proyecto separa las responsabilidades de la aplicación en diferentes directorios:

```text
src/
├── components/
│   ├── TodoForm.tsx
│   └── TodoItem.tsx
├── features/
│   └── auth/
│       └── AuthContext.tsx
├── hooks/
│   └── useTasks.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── TasksPage.tsx
├── routes/
│   └── ProtectedRoute.tsx
├── services/
│   ├── authService.ts
│   ├── emailService.ts
│   ├── firebase.ts
│   └── taskService.ts
├── tests/
│   ├── setup.ts
│   ├── TodoForm.test.tsx
│   └── TodoItem.test.tsx
├── types/
│   └── task.ts
└── utils/

api/
└── send-summary.ts

firestore.rules
```

La lógica de acceso a Firebase se encuentra separada de los componentes visuales mediante servicios y hooks.

La autenticación global se administra mediante `AuthContext`, mientras que `ProtectedRoute` impide acceder a las páginas privadas cuando no existe un usuario autenticado.

## Modelo de tareas

Cada tarea contiene los siguientes datos:

```ts
interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

El campo `userId` permite asociar cada tarea con el usuario que la creó.

## Seguridad de Firestore

Las reglas de Firestore verifican que exista un usuario autenticado y que el `userId` de la tarea coincida con su UID.

De esta forma, cada usuario solamente puede acceder y modificar sus propias tareas.

Las reglas utilizadas se encuentran en:

```text
firestore.rules
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Variables necesarias:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
```

Las credenciales reales no se incluyen en el repositorio.

Las variables que comienzan con `VITE_` son utilizadas por el frontend para configurar Firebase.

Las credenciales de AWS son utilizadas únicamente en el entorno del servidor mediante una Vercel Function y nunca se exponen en el código del frontend.

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` y configurar las variables necesarias.

Para iniciar solamente el frontend durante el desarrollo:

```bash
npm run dev
```

Para ejecutar la aplicación junto con la función serverless de Vercel:

```bash
npx vercel dev
```

## Autenticación

Firebase Authentication gestiona el registro, inicio de sesión y cierre de sesión mediante email y contraseña.

`onAuthStateChanged` permite mantener sincronizado el estado de autenticación de la aplicación.

Las rutas privadas están protegidas mediante el componente `ProtectedRoute`.

## Firestore

Las tareas se almacenan en la colección:

```text
tasks
```

Las consultas filtran los documentos mediante el `userId` del usuario autenticado.

La aplicación utiliza `onSnapshot` para recibir los cambios de Firestore en tiempo real.

## Envío de emails con AWS SES

El frontend nunca accede directamente a las credenciales de AWS.

El flujo utilizado es:

```text
Usuario
   ↓
React
   ↓
POST /api/send-summary
   ↓
Vercel Function
   ↓
AWS SES
   ↓
Email con resumen de tareas
```

La función ubicada en `api/send-summary.ts` recibe el resumen de las tareas y utiliza AWS SES para realizar el envío.

Las credenciales de AWS se almacenan exclusivamente como variables de entorno del servidor.

### AWS SES Sandbox

Durante el desarrollo se utilizó AWS SES en su entorno de pruebas. Dependiendo del estado de la cuenta de SES, puede ser necesario que las direcciones de destino estén verificadas antes de poder recibir emails.

## Testing

Los tests se ejecutan con:

```bash
npm test
```

Actualmente se incluyen pruebas para componentes clave de la aplicación.

Se utilizan mocks para evitar depender de Firebase durante los tests unitarios.

Los tests comprueban, entre otros comportamientos:

- Validación del formulario de creación.
- Creación de tareas.
- Renderizado de una tarea.
- Cambio de estado de una tarea.
- Eliminación de tareas.
- Edición de tareas.

## Build

Para generar el build de producción:

```bash
npm run build
```

Para ejecutar el linter:

```bash
npm run lint
```

## Deploy

La aplicación está preparada para desplegarse en Vercel.

URL de producción:

```text
PENDIENTE - completar después del deploy
```

Las variables de entorno necesarias deben configurarse también en el proyecto de Vercel.

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó ChatGPT como herramienta de apoyo.

Se utilizó principalmente para:

- Planificar la arquitectura inicial del proyecto.
- Comprender la integración entre React, Firebase y Firestore.
- Implementar y revisar el flujo de autenticación.
- Estructurar el CRUD de tareas.
- Comprender la integración entre AWS SES y Vercel Functions.
- Resolver errores de configuración.
- Preparar tests con Vitest y React Testing Library.
- Revisar la organización y documentación del proyecto.

Ejemplos de consultas realizadas:

- Cómo estructurar una SPA de gestión de tareas con React y TypeScript.
- Cómo proteger rutas utilizando Firebase Authentication.
- Cómo filtrar tareas de Firestore por usuario.
- Cómo enviar emails con AWS SES sin exponer las credenciales en el frontend.
- Cómo utilizar mocks de servicios externos en Vitest.

Las respuestas generadas con IA fueron revisadas y validadas mediante pruebas manuales, ejecución de tests, compilación de TypeScript y verificación del funcionamiento de la aplicación.

## Validaciones realizadas

Se verificó manualmente:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Protección de rutas.
- Creación de tareas.
- Lectura de tareas.
- Edición de tareas.
- Eliminación de tareas.
- Cambio de estado.
- Separación de tareas por usuario.
- Envío de resumen mediante AWS SES.

También se verificó el proyecto mediante:

```bash
npm test
npm run build
npm run lint
```

## Estado del proyecto

El proyecto implementa las funcionalidades principales solicitadas para el Gestor Estratégico de Tareas.

