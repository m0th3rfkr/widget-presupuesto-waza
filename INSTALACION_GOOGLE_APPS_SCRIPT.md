# 🚀 INSTALACIÓN GOOGLE APPS SCRIPT - AUTO FORMATEO WAZA

## ¿Qué hace este script?

✅ **Se ejecuta automáticamente** cada vez que alguien abre el spreadsheet
✅ **Aplica formato profesional** a las 3 secciones (Arquitectura, Funcionales, No Funcionales)
✅ **Corrige posicionamiento** de títulos y headers
✅ **Se copia automáticamente** con el template a todos los documentos nuevos
✅ **Sin intervención manual** - formateo invisible y automático

## 📋 PASOS DE INSTALACIÓN

### 1. Abrir Google Apps Script en tu template

1. Ve a tu **template spreadsheet**: https://docs.google.com/spreadsheets/d/1wR49oqHn3NdKj9pFzMdM2fpFpcYx7CxIZhLUHolWcA4
2. Menú **Extensiones** → **Apps Script**
3. Se abrirá el editor de Google Apps Script

### 2. Reemplazar código por defecto

1. **Elimina** todo el código que aparece por defecto (función myFunction())
2. **Copia y pega** todo el contenido del archivo `google-apps-script-autoformat.js`
3. **Guarda** el proyecto (Ctrl+S o Cmd+S)

### 3. Configurar permisos

1. Haz clic en **▶️ Ejecutar** (para probar)
2. Google pedirá **autorización** - acepta todos los permisos
3. El script necesita acceso para:
   - Leer/escribir en spreadsheets
   - Ejecutarse automáticamente al abrir

### 4. Verificar funcionamiento

1. **Cierra** el spreadsheet completamente
2. **Vuelve a abrir** el spreadsheet
3. Después de 2-3 segundos deberías ver:
   - ✅ Títulos "Requisitos No Funcionales" en posición correcta
   - ✅ Headers "ITEM, DESCRIPCION" bien formateados
   - ✅ Colores aplicados automáticamente (azul, rojo, amarillo)

## 🎯 RESULTADO ESPERADO

**ANTES:**
- Títulos mal posicionados
- Filas vacías entre headers
- Sin formato de colores

**DESPUÉS (Automático):**
- ✅ "Arquitectura Técnica" (fila 6) - Azul
- ✅ "Requisitos Funcionales" (fila 13) - Azul
- ✅ "Requisitos No Funcionales" (fila 20) - Azul
- ✅ Headers "ITEM" en posiciones correctas
- ✅ Sin filas vacías
- ✅ Colores profesionales aplicados
- ✅ Bordes y formato consistente

## 🔄 PROPAGACIÓN AUTOMÁTICA

Una vez instalado en el **template original**:

1. **Cada nueva copia** del template incluirá el script automáticamente
2. **No requiere instalación adicional** en copias
3. **Funciona inmediatamente** al abrir cualquier documento nuevo
4. **Zero-configuration** para usuarios finales

## 🐛 TROUBLESHOOTING

**Si no funciona:**
1. Verifica que el script esté guardado
2. Ejecuta manualmente la función `reaplicarFormato()`
3. Revisa la consola de Apps Script para errores
4. Asegúrate de tener permisos de edición en el spreadsheet

**Para re-aplicar formato manualmente:**
1. Extensiones → Apps Script
2. Ejecutar función `reaplicarFormato()`

## 📝 VENTAJAS vs JavaScript Externo

| Aspecto | JavaScript Externo | Google Apps Script |
|---------|-------------------|-------------------|
| **Instalación** | Compleja (OAuth, APIs) | Simple (1 vez) |
| **Propagación** | Manual cada vez | Automática |
| **Permisos** | Problemas OAuth | Sin problemas |
| **Ejecución** | Botón manual | Automática |
| **Mantenimiento** | Complejo | Mínimo |
| **Performance** | Lento (API calls) | Instantáneo |

## 🎉 RESULTADO FINAL

Con este script, **cada nueva cotización tendrá formato perfecto automáticamente**, sin que el usuario tenga que hacer nada. ¡El cliente simplemente abre el documento y ya está todo formateado profesionalmente!