# Gestor Estratégico de Tareas

SPA desarrollada como Proyecto Integrador 4 de MateCode para gestionar tareas personales.

Permite registrarse, iniciar sesión y administrar tareas privadas. Cada usuario puede crear, editar, completar y eliminar sus tareas, además de recibir un resumen por email mediante AWS SES.

## Funcionalidades

- Registro, inicio y cierre de sesión.
- Persistencia de sesión y rutas privadas.
- CRUD completo de tareas.
- Tareas independientes por usuario.
- Actualización en tiempo real con Firestore.
- Estados de carga y manejo de errores.
- Envío de resumen de tareas por email.
- Diseño responsive.
- Tests con Vitest y React Testing Library.

## Tecnologías

- React + TypeScript + Vite
- React Router DOM
- Firebase Authentication
- Cloud Firestore
- AWS SES
- Vercel Functions
- Vitest + React Testing Library

## Arquitectura

```text
src/
├── components/
├── features/auth/
├── hooks/
├── pages/
├── routes/
├── services/
├── tests/
├── types/
└── utils/

api/
└── send-summary.ts

firestore.rules
```

La aplicación separa componentes, páginas, autenticación, servicios y acceso a datos.

`AuthContext` administra el estado global de autenticación, `ProtectedRoute` protege las rutas privadas y `useTasks` obtiene en tiempo real las tareas del usuario autenticado.

Firestore utiliza el `userId` de cada tarea para separar los datos por usuario. Las reglas de `firestore.rules` impiden que un usuario acceda o modifique tareas pertenecientes a otro usuario.

## Variables de entorno

Crear `.env` a partir de `.env.example`:

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

Las credenciales reales no se incluyen en el repositorio. Las credenciales de AWS se utilizan únicamente desde la función serverless.

## Instalación

```bash
npm install
npm run dev
```

Para ejecutar también la función de Vercel localmente:

```bash
npx vercel dev
```

## Envío de emails

El resumen de tareas se envía mediante el siguiente flujo:

```text
React
  ↓
POST /api/send-summary
  ↓
Vercel Function
  ↓
AWS SES
  ↓
Email
```

La función `api/send-summary.ts` utiliza las credenciales de AWS almacenadas como variables de entorno del servidor, evitando exponerlas en el frontend.

Durante el desarrollo se utilizó AWS SES en entorno sandbox, por lo que pueden aplicarse restricciones sobre las direcciones de destino.

## Testing

Ejecutar los tests con:

```bash
npm test
```

El proyecto incluye tests de componentes para validar creación, edición, eliminación y cambio de estado de las tareas.

También se puede comprobar el proyecto con:

```bash
npm run build
npm run lint
```

Resultados finales:

- 6 tests aprobados.
- Build de producción correcto.
- 0 errores de lint.

## Deploy

Aplicación desplegada en Vercel:

https://proyecto-integrador-4-livid.vercel.app

Firebase, Firestore y el envío mediante AWS SES fueron verificados también en producción.

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó ChatGPT como herramienta de apoyo para:

- Planificar la arquitectura del proyecto.
- Comprender e implementar Firebase Authentication y Firestore.
- Estructurar el CRUD de tareas.
- Integrar AWS SES mediante Vercel Functions.
- Resolver errores de configuración.
- Preparar tests y revisar la documentación.

Ejemplos de consultas realizadas:

- Cómo proteger rutas con Firebase Authentication.
- Cómo filtrar tareas de Firestore por usuario.
- Cómo enviar emails con AWS SES sin exponer credenciales.
- Cómo realizar mocks de servicios externos con Vitest.

Las respuestas generadas con IA fueron revisadas y validadas mediante pruebas manuales, tests y compilación del proyecto.

