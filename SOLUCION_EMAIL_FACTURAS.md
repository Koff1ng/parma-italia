# 🔧 Solución: Email de Facturas No Llega

## ✅ Pasos para Verificar y Solucionar

### 1. Verificar Configuración de Email

Asegúrate de tener el archivo `functions/.env` con las credenciales:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
```

**⚠️ IMPORTANTE:** 
- `EMAIL_USER` debe ser tu email de Gmail completo
- `EMAIL_PASS` debe ser una **App Password** de Gmail (NO tu contraseña normal)

### 2. Obtener App Password de Gmail

1. Ve a tu cuenta de Google → [Seguridad](https://myaccount.google.com/security)
2. Activa **"Verificación en 2 pasos"** (si no está activada)
3. Ve a **"Contraseñas de aplicaciones"**
4. Genera una nueva contraseña para "Correo"
5. Copia esa contraseña y úsala en `EMAIL_PASS`

### 3. Verificar Logs de Firebase Functions

Para ver qué está pasando cuando se crea una factura:

```bash
firebase functions:log --only onFacturaCreated
```

O ver todos los logs:
```bash
firebase functions:log
```

### 4. Verificar que el Cliente Tiene Email

Cuando creas una factura manual desde el dashboard, asegúrate de:
- ✅ Completar el campo **"Email Fiscal"** en el formulario
- ✅ El email debe ser válido (ej: cliente@ejemplo.com)

### 5. Reenviar Factura Manualmente

Si la factura ya fue creada pero no llegó el email:

1. Ve al Dashboard → Gestión de Facturas Electrónicas
2. Busca la factura
3. Haz clic en el botón **📧** (o **📧 ✓** si ya se envió)
4. Esto llamará al endpoint `reenviarFacturaEmail` para reenviar

### 6. Verificar Estado de la Factura

En Firebase Console:
1. Ve a Realtime Database → `facturas/{facturaId}`
2. Verifica:
   - `emailEnviado`: debe ser `true` si se envió
   - `emailEnviadoFecha`: timestamp cuando se envió
   - `cliente.emailFiscal`: debe tener un email válido

## 🔍 Posibles Problemas y Soluciones

### Problema: "EMAIL_USER y EMAIL_PASS deben estar configurados"
**Solución:** Crea `functions/.env` con las credenciales y vuelve a desplegar:
```bash
cd functions
# Edita .env con tus credenciales
cd ..
firebase deploy --only functions
```

### Problema: "No hay email del cliente"
**Solución:** Al crear la factura manual, completa el campo "Email Fiscal"

### Problema: "Error de autenticación Gmail"
**Solución:** 
- Verifica que usas App Password, no tu contraseña normal
- Asegúrate de que la verificación en 2 pasos esté activada
- Verifica que el email en `EMAIL_USER` sea correcto

### Problema: El trigger no se ejecuta
**Solución:**
- Verifica los logs: `firebase functions:log --only onFacturaCreated`
- Asegúrate de que la función esté desplegada
- Verifica que la factura se guardó correctamente en Firebase

## 📧 Probar Envío Manual

Puedes probar el envío manualmente usando el botón 📧 en el dashboard de facturas, o llamando directamente al endpoint:

```bash
curl -X POST https://us-central1-parma-shop-b49a2.cloudfunctions.net/reenviarFacturaEmail \
  -H "Content-Type: application/json" \
  -d '{"facturaId": "factura_1234567890"}'
```

## ✅ Checklist de Verificación

- [ ] `functions/.env` existe y tiene `EMAIL_USER` y `EMAIL_PASS`
- [ ] `EMAIL_PASS` es una App Password de Gmail (no contraseña normal)
- [ ] Verificación en 2 pasos de Gmail está activada
- [ ] Las funciones están desplegadas: `firebase deploy --only functions`
- [ ] Al crear factura manual, se completa el campo "Email Fiscal"
- [ ] Los logs muestran que el trigger se ejecuta (verificar con `firebase functions:log`)

