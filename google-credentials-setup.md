# Configuración de Google Sheets API

Para que la integración automática funcione, necesitas configurar las credenciales de Google API.

## Pasos para configurar:

### 1. Crear Google Cloud Project
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID**

### 2. Habilitar APIs
1. Ve a "APIs & Services" > "Library"
2. Busca y habilita:
   - **Google Sheets API**
   - **Google Drive API**

### 3. Crear credenciales

#### API Key:
1. Ve a "APIs & Services" > "Credentials"
2. Clic en "Create Credentials" > "API Key"
3. Copia la API Key

#### OAuth 2.0 Client ID:
1. En "Credentials", clic en "Create Credentials" > "OAuth client ID"
2. Tipo: "Web application"
3. Authorized JavaScript origins: `http://localhost:8000` (y tu dominio)
4. Copia el Client ID

### 4. Configurar en el código
En `cotizador.html`, busca esta sección:

```javascript
const GOOGLE_CONFIG = {
    apiKey: 'TU_API_KEY_AQUI', // Reemplaza con tu API Key
    clientId: 'TU_CLIENT_ID_AQUI', // Reemplaza con tu Client ID
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
};
```

### 5. Hacer público tu template
1. Abre tu Google Sheet template
2. Clic en "Compartir" 
3. Cambiar a "Cualquier persona con el enlace puede ver"
4. Copiar el ID del enlace (la parte entre `/d/` y `/edit`)

## Flujo automático:
1. Usuario hace clic en "📋 Generar Google Sheets"
2. Se autentica con Google (popup)
3. Se crea automáticamente una copia del template
4. Se llenan todos los datos automáticamente
5. Se abre el sheet completado

## Seguridad:
- Las credenciales solo permiten acceso a Sheets/Drive
- El usuario debe autenticarse cada vez
- No se almacenan credenciales sensibles