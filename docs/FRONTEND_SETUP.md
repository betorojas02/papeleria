# 🚀 Instrucciones para Configurar el Frontend

## ✅ Proyecto Creado

El proyecto Vue 3 se creó exitosamente en:
```
/Users/betorojas/Documents/Papeleria/papeleria-frontend
```

---

## 📋 Pasos para Continuar

### 1. Abrir el proyecto en VS Code

```bash
cd /Users/betorojas/Documents/Papeleria/papeleria-frontend
code .
```

### 2. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Instalar dependencias del proyecto

```bash
npm install vue-router@4 pinia axios @heroicons/vue @headlessui/vue
npm install -D @vitejs/plugin-vue
```

### 4. Configurar Tailwind CSS

Editar `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

### 5. Crear archivo CSS principal

Crear `src/assets/styles/main.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Importar CSS en main.js

Editar `src/main.js`:
```js
import { createApp } from 'vue'
import './assets/styles/main.css'
import App from './App.vue'

createApp(App).mount('#app')
```

---

## 🎯 Siguiente Paso

Una vez completados estos pasos, avísame y continuaré con:
- ✅ Configuración de Vue Router
- ✅ Configuración de Pinia
- ✅ Estructura de carpetas
- ✅ Componentes base
- ✅ Vistas principales
