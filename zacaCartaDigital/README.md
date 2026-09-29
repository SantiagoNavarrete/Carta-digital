# EntreNos

Carta digital en React/Vite con datos en tiempo real desde Firebase Firestore y administración privada en `/admin`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Configurar Firebase

1. Crea un proyecto Firebase, habilita Firestore y Authentication con proveedor de correo/contraseña.
2. Crea el usuario administrador desde Firebase Authentication.
3. Define las variables de `.env.example` en un archivo `.env`. `VITE_FIREBASE_*` corresponde a la aplicación web de Firebase; `FIREBASE_SEED_EMAIL` y `FIREBASE_SEED_PASSWORD` corresponden al usuario administrador.
4. Publica `firestore.rules` en Firestore Rules antes de cargar los datos.
5. Ejecuta `npm run seed:firestore` para cargar productos MXN, zonas de delivery y `config/general`.
6. Ejecuta `npm run dev` y abre `/admin` para gestionar el contenido.

El seed usa IDs estables y se puede repetir sin duplicar productos o zonas. No guardes `.env` en el repositorio.

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
