# Proyecto Final Backend. Comisión 50035

## Autor
Juan José Boydo

## Descripción
Proyecto final para la comisión 50035 del curso de backend de Coderhouse. El proyecto consiste en una API para la gestión de productos, carritos de compras y usuarios, incluyendo autenticación, vistas utilizando Handlebars, documentación y tests.

## Tecnologías utilizadas
- Node.js
- Express
- MongoDB
- Mongoose
- Handlebars
- JWT
- Supertest
- Swagger
- Nodemailer
- Bcrypt
- Dotenv
- Winston

## Vistas

El proyecto incluye vistas utilizando Handlebars. Estas vistas se encuentran en la carpeta `views` y se utilizan para mostrar la información de los productos y carritos de compras.

- 'cart.handlebars': Vista del carrito de compras. Muestra los productos agregados al carrito y permite eliminarlos, y finalizar la compra.
- 'login.handlebars': Vista de login. Permite iniciar sesión con un usuario registrado, ademas de loguarse con una cuenta de GitHub.
- 'register.handlebars': Vista de registro. Permite registrar un nuevo usuario.
- 'profile.handlebars': Vista de perfil. Muestra la información del usuario logueado y permite recuperar la contraseña.
- 'products.handlebars': Vista de productos. Muestra los productos disponibles y permite agregarlos al carrito.
- 'users.handlebars': Vista de usuarios solo disponible para el admin. Muestra los usuarios registrados y permite eliminarlos.
- 'recoverPassword.handlebars': Vista de reseteo de contraseña. Permite enviar un email para resetear la contraseña.
- 'resetPassword.handlebars': Vista de recuperación de contraseña. Permite cambiar la contraseña del usuario.
- 'chat.handlebars': Vista de chat. Permite enviar y recibir mensajes en tiempo real.

## Utilitarios

En el directorio `utils` se encuentran varias funciones de ayuda, como la configuración de Handlebars, manejo de errores y otras utilidades necesarias para el funcionamiento del proyecto.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/jjboydo/proyecto-backend-50035.git

2. Navega al directorio del proyecto:
    ```bash 
    cd proyecto-backend-50035

3. Instala las dependencias:
    ```bash
    npm install

4. Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias

5. Inicia el servidor:
    ```bash
    npm start

## Postman

Puede importar la colección de Postman con los endpoints de la API mediante el siguiente enlace: [text](https://www.postman.com/supply-astronaut-88236488/workspace/coderspace/collection/32342968-68c7fae5-dc79-4717-a62c-d545d6eb2b13?action=share&source=copy-link&creator=32342968)

## Documentación

La documentación de la API se encuentra en la carpeta docs del proyecto. Puede acceder a ella mediante el siguiente enlace: http://localhost:8080/api/docs

## Tests

Para correr los tests, ejecute el siguiente comando:

```bash
npm supertest
```
