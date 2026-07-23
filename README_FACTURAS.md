# Configuración de Facturas Electrónicas y Envío por Email

## 🔧 Configuración Requerida

### 1. Instalar dependencias en Functions

```bash
cd functions
npm install nodemailer
```

### 2. Configurar variables de entorno

Crea o edita el archivo `functions/.env` con las siguientes variables:

```env
# Email Configuration (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-aqui
```

**Para obtener App Password de Gmail:**
1. Ve a tu cuenta de Google
2. Seguridad > Verificación en 2 pasos (debe estar activada)
3. Contraseñas de aplicaciones > Generar nueva
4. Usa esa contraseña en `EMAIL_PASS`

### 3. Desplegar reglas de Firebase Database

```bash
firebase deploy --only database
```

### 4. Desplegar funciones de Firebase

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 📧 Funcionalidad de Envío de Emails

### Automático
- Cuando se crea una factura (desde checkout o dashboard), se envía automáticamente por email si el cliente tiene email configurado
- El trigger `onFacturaCreated` detecta nuevas facturas y envía el email

### Manual
- Desde el dashboard de facturas, hay un botón 📧 para reenviar la factura por correo
- El botón muestra ✓ si ya se envió el email

## 📋 Contenido del Email

El email incluye:
- Número de factura y CUFE
- Datos del emisor y cliente
- Detalle de items con precios
- Subtotal, descuento, IVA y total
- Archivo XML adjunto con la factura en formato UBL 2.1

## 🔒 Permisos de Firebase

Las reglas de base de datos permiten:
- Lectura de productos y cupones: público
- Escritura de productos y cupones: solo autenticados
- Lectura de pedidos, clientes y facturas: solo autenticados
- Escritura de pedidos, clientes y facturas: público (para que el checkout pueda crear)

## ⚠️ Solución de Problemas

### Error "Permission denied"
1. Verifica que las reglas de Firebase estén desplegadas: `firebase deploy --only database`
2. Verifica que estés autenticado en el dashboard
3. Revisa la consola de Firebase para ver los permisos exactos

### Email no se envía
1. Verifica que `EMAIL_USER` y `EMAIL_PASS` estén configurados en `functions/.env`
2. Verifica que el cliente tenga email (`emailFiscal` o `correo`)
3. Revisa los logs de Firebase Functions: `firebase functions:log`
4. Asegúrate de que la función `onFacturaCreated` esté desplegada

