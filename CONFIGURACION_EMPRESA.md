# 📋 Configuración de Datos de la Empresa

## ⚠️ IMPORTANTE: Actualiza estos datos en DOS lugares

Los datos de tu empresa (PARMA ITALIA) deben actualizarse en **2 archivos** para que las facturas se generen correctamente:

### 1. Frontend: `src/services/FacturaService.js` (línea ~6)

```javascript
static EMPRESA = {
  nit: "1003401790", // ⚠️ TU NIT REAL
  razonSocial: "PARMA ITALIA S.A.S.", // ⚠️ TU RAZÓN SOCIAL
  direccion: "Cali, Colombia", // ⚠️ TU DIRECCIÓN
  telefono: "+57 311 352 4794", // ⚠️ TU TELÉFONO
  email: "gerencia@clientumstudio.com", // ⚠️ TU EMAIL
  regimen: "48", // 48 = Simplificado, 49 = Ordinario
  tipoPersona: "1", // 1 = Natural, 2 = Jurídica
};
```

### 2. Backend: `functions/index.js` (línea ~20)

```javascript
const EMPRESA_DATA = {
  nit: "1003401790", // ⚠️ TU NIT REAL
  razonSocial: "PARMA ITALIA S.A.S.", // ⚠️ TU RAZÓN SOCIAL
  direccion: "Cali, Colombia", // ⚠️ TU DIRECCIÓN
  telefono: "+57 311 352 4794", // ⚠️ TU TELÉFONO
  email: "gerencia@clientumstudio.com", // ⚠️ TU EMAIL
  regimen: "48", // 48 = Simplificado, 49 = Ordinario
  tipoPersona: "1", // 1 = Natural, 2 = Jurídica
};
```

## 📝 Campos a modificar

- **nit**: Tu NIT completo con dígito de verificación (ej: "900123456-7")
- **razonSocial**: Nombre legal de tu empresa
- **direccion**: Dirección completa de tu empresa
- **telefono**: Teléfono de contacto
- **email**: Email para facturación
- **regimen**: 
  - `"48"` = Régimen Simplificado
  - `"49"` = Régimen Ordinario
- **tipoPersona**:
  - `"1"` = Persona Natural
  - `"2"` = Persona Jurídica

## 🔄 Después de modificar

1. Si modificaste `functions/index.js`, despliega las funciones:
   ```bash
   firebase deploy --only functions
   ```

2. Si solo modificaste `src/services/FacturaService.js`, reconstruye la app:
   ```bash
   npm run build
   ```

## ✅ Verificación

Después de actualizar, verifica que:
- Las facturas muestren los datos correctos
- Los emails tengan la información correcta
- El XML de la factura tenga los datos del emisor correctos

