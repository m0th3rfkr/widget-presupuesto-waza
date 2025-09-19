/**
 * WAZA COTIZADOR - AUTO FORMATEO
 * Script que se ejecuta automáticamente al abrir cualquier copia del template
 * Aplica formateo profesional y estructura las 3 secciones correctamente
 */

function onOpen() {
  console.log('🚀 WAZA Auto-Format iniciando...');

  // Esperar 2 segundos para que el sheet cargue completamente
  Utilities.sleep(2000);

  try {
    aplicarFormatoWaza();
    console.log('✅ Formato WAZA aplicado exitosamente');
  } catch (error) {
    console.error('❌ Error aplicando formato:', error);
  }
}

function aplicarFormatoWaza() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Aplicar formato a todos los tabs (Básico, Estándar, Premium)
  const sheets = ss.getSheets();

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    if (sheetName.includes('25%') || sheetName.includes('100%') || sheetName.includes('175%')) {
      console.log(`🎨 Formateando tab: ${sheetName}`);
      formatearTab(sheet);
    }
  });
}

function formatearTab(sheet) {
  try {
    // 1. FORMATEAR HEADERS PRINCIPALES (Filas 5-6)
    formatearHeadersPrincipales(sheet);

    // 2. FORMATEAR SECCIÓN ARQUITECTURA TÉCNICA (Filas 6-11)
    formatearSeccionArquitectura(sheet);

    // 3. FORMATEAR SECCIÓN REQUISITOS FUNCIONALES (Filas 13-19)
    formatearSeccionFuncionales(sheet);

    // 4. FORMATEAR SECCIÓN REQUISITOS NO FUNCIONALES (Filas 20-25)
    formatearSeccionNoFuncionales(sheet);

    // 5. APLICAR FORMATO GENERAL
    aplicarFormatoGeneral(sheet);

    console.log(`✅ Tab ${sheet.getName()} formateado exitosamente`);

  } catch (error) {
    console.error(`❌ Error formateando tab ${sheet.getName()}:`, error);
  }
}

function formatearHeadersPrincipales(sheet) {
  // Headers principales en fila 5-6 con colores específicos

  // Fila 5: AI (Azul), HUMANOS (Rojo), MARKUP (Amarillo)
  sheet.getRange('C5:G5').setBackground('#4285f4').setFontColor('white').setFontWeight('bold'); // AI - Azul
  sheet.getRange('H5:L5').setBackground('#db4437').setFontColor('white').setFontWeight('bold'); // HUMANOS - Rojo
  sheet.getRange('M5:M5').setBackground('#f4b400').setFontColor('white').setFontWeight('bold'); // MARKUP - Amarillo

  // Fila 6: Subheaders con mismo patrón de colores
  sheet.getRange('C6:G6').setBackground('#4285f4').setFontColor('white').setFontWeight('bold'); // AI
  sheet.getRange('H6:L6').setBackground('#db4437').setFontColor('white').setFontWeight('bold'); // HUMANOS
  sheet.getRange('M6:M6').setBackground('#f4b400').setFontColor('white').setFontWeight('bold'); // MARKUP
}

function formatearSeccionArquitectura(sheet) {
  // Título "Arquitectura Técnica" en fila 6
  sheet.getRange('A6:B6').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');

  // Header "ITEM, DESCRIPCION" en fila 7
  sheet.getRange('A7:B7').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');

  // Datos (filas 8-11) - fondo blanco con bordes
  sheet.getRange('A8:O11').setBackground('white').setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
}

function formatearSeccionFuncionales(sheet) {
  // Título "Requisitos Funcionales" en fila 13
  sheet.getRange('A13:B13').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
  sheet.getRange('A13').setValue('Requisitos Funcionales');

  // Header "ITEM, DESCRIPCION" en fila 14
  sheet.getRange('A14:B14').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
  sheet.getRange('A14').setValue('ITEM');
  sheet.getRange('B14').setValue('DESCRIPCION');

  // Datos (filas 15-19) - fondo blanco con bordes
  sheet.getRange('A15:O19').setBackground('white').setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
}

function formatearSeccionNoFuncionales(sheet) {
  // Título "Requisitos No Funcionales" en fila 20
  sheet.getRange('A20:B20').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
  sheet.getRange('A20').setValue('Requisitos No Funcionales');

  // Header "ITEM, DESCRIPCION" en fila 21
  sheet.getRange('A21:B21').setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
  sheet.getRange('A21').setValue('ITEM');
  sheet.getRange('B21').setValue('DESCRIPCION');

  // Datos (filas 22-25) - fondo blanco con bordes
  sheet.getRange('A22:O25').setBackground('white').setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
}

function aplicarFormatoGeneral(sheet) {
  // Formato general para todo el sheet

  // 1. Texto negro para mejor legibilidad
  sheet.getRange('A1:O30').setFontColor('black');

  // 2. Centrar texto en headers
  sheet.getRange('A5:O6').setHorizontalAlignment('center');
  sheet.getRange('A7:B7').setHorizontalAlignment('center');
  sheet.getRange('A14:B14').setHorizontalAlignment('center');
  sheet.getRange('A21:B21').setHorizontalAlignment('center');

  // 3. Ajustar anchos de columna
  sheet.setColumnWidth(1, 50);  // Columna A (números)
  sheet.setColumnWidth(2, 250); // Columna B (nombres/descripción)

  // 4. Congelar filas de header
  sheet.setFrozenRows(6);
}

/**
 * Función manual para re-aplicar formato (por si es necesario)
 */
function reaplicarFormato() {
  aplicarFormatoWaza();
  SpreadsheetApp.getUi().alert('✅ Formato WAZA re-aplicado exitosamente');
}