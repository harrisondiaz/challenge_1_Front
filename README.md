# Aplicación de Gestión de Tareas

Una aplicación moderna de gestión de tareas construida con Angular, que incluye autenticación de usuarios y seguimiento de tareas en tiempo real.

## Características

- 🔐 Autenticación de usuarios (inicio de sesión/registro)
- ✨ Creación y gestión de tareas
- 🎯 Actualizaciones de tareas en tiempo real
- 🎨 Interfaz moderna con Tailwind CSS
- 🔄 Diseño responsivo

## Requisitos Previos

Antes de ejecutar esta aplicación, asegúrate de tener:

- Node.js (v14 o superior)
- npm (v6 o superior)
- Angular CLI (v19 o superior)

## Instalación

1. Clona el repositorio y entra en el directorio del proyecto:
```bash
git clone https://github.com/harrisondiaz/challenge_1_Front.git Challenge_1_front
cd Challenge_1_front
```

## Servidor de Desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquiera de los archivos fuente.

## Generación de Código

Angular CLI incluye potentes herramientas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-componente
```

Para una lista completa de los esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación

Para compilar el proyecto ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los archivos de compilación en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para rendimiento y velocidad.

## Ejecutar Pruebas Unitarias

Para ejecutar pruebas unitarias con el corredor de pruebas [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```

## Despliegue

Para desplegar la aplicación en producción ejecuta:

```bash
ng build --configuration production
```

## Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página de [Descripción general y referencia de comandos de Angular CLI](https://angular.dev/tools/cli).
