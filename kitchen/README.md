# **Kmbrer-Waiter**

Kmbrer-Waiter es el **módulo de cocicna para complementar Kmbrer-Card** que funciona con el backend de **Kmbrer**. Permite a los usuarios de cocina conocer todas las comandas que hay en un mismo restaurante.

Este proyecto utiliza **React**, **TypeScript** y **Vite** para ofrecer una experiencia rápida y eficiente.

---

## **Requisitos previos**

Asegúrate de tener instalados:

- **Node.js** (versión 16 o superior)
- **npm** o **pnpm**
- Backend de **Kmbrer** configurado con mesas y códigos QR.

---

## **Instalación**

Clona este repositorio y accede a la carpeta del proyecto:

```bash
git clone git@github.com:ipepio/kmbrer-card.git
cd kmbrer-card
Instala las dependencias necesarias:
```
```bash
npm install
# o si prefieres pnpm
pnpm install
```
## Ejecución del proyecto
Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:2173.

## Uso
1. Iniciar sesión y esperar las notificaciones
2. Ver la carta digital
Una vez iniciada la sesión, estaremos a la espera de recibir las notificaciones y marcarlas como listas o pararlas

## Scripts disponibles
Comando | Descripción
npm run dev | Inicia el servidor de desarrollo en http://localhost:3173.
npm run build | Compila el proyecto para producción.
npm run lint | Ejecuta ESLint para verificar el código.
npm run preview | Previsualiza la aplicación compilada.

## Linting y Calidad de Código
Este proyecto utiliza ESLint con reglas específicas para React y TypeScript. Ejecuta el siguiente comando para verificar el código:

```bash
npm run lint
```
Si deseas reglas más estrictas o personalizadas, puedes expandir la configuración de ESLint en el archivo eslint.config.js.

## Compilación para Producción
Para compilar la aplicación en modo producción, ejecuta:

```bash
npm run build
```
El resultado se guardará en la carpeta dist/.

## Previsualización de la aplicación compilada
Puedes previsualizar la versión compilada localmente con:

```bash
npm run preview
```
La aplicación estará disponible en http://localhost:3173.

## Tecnologías utilizadas
⚛️ React: Biblioteca para interfaces de usuario.
🛠 TypeScript: Tipado estático para un desarrollo robusto.
⚡️ Vite: Herramienta de construcción rápida.
🧹 ESLint: Garantiza un código limpio y de calidad.

## Licencia
Este proyecto está bajo la licencia MIT.

