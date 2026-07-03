# API de Adopciones - Proyecto Final Backend

Este proyecto es la entrega final del curso de Programación Backend. Incluye una API REST construida con Node.js y Express, con pruebas funcionales (Jest + Supertest), documentación interactiva (Swagger) y dockerización optimizada.

## URLs del Proyecto

**Repositorio de Código:** https://github.com/chrisherrero/propyecto-final-backend/tree/main
**Imagen en DockerHub:** https://hub.docker.com/r/babalu1808/api-adopciones


## Estructura del Proyecto

'''text
proyecto-final-backend/
├── src/
│   ├── app.js               # Configuración de Express y middlewares
│   ├── server.js            # Punto de entrada del servidor
│   └── adoption.router.js   # Lógica y rutas de los endpoints de adopciones
├── tests/
│   └── adoption.test.js     # Tests funcionales con mocks de procesos hijos
├── Dockerfile               # Instrucciones de construcción de la imagen (Multistage)
├── .dockerignore            # Exclusión de archivos innecesarios para optimizar peso
├── package.json             # Dependencias y scripts
└── README.md                # Documentación del proyecto

## Estructura del Proyecto 

Para correr la aplicación sin necesidad de instalar Node.js localmente, podés usar la imagen de DockerHub.

1. Descargar y ejecutar la imagen directamente desde DockerHub:

docker run -p 3000:3000 --name api-adopciones TU_USUARIO_DE_DOCKERHUB/api-adopciones:1.0.0

1. Construir la imagen localmente:

docker build -t api-adopciones:1.0.0 .
docker run -p 3000:3000 --name api-adopciones api-adopciones:1.0.0

El servidor estará corriendo en http://localhost:3000.

## Cómo correr los Tests Funcionales

Los tests utilizan Jest y Supertest para validar los endpoints, mockeando dependencias externas (child_process) y manipulando process.env.

1. Instalar las dependencias (si estás en el entorno de desarrollo):

npm install

2. Ejecutar la suite de pruebas con reporte de cobertura:

npm test