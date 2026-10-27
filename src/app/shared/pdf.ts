export interface DatosProducto {
  sku: string;
  nombre: string;
  categoria: string;
  stockMinimo: number;
  fechaNacimiento: string;
  password: string; // ya cifrada (SHA-256)
}

// Genera y descarga un PDF con los datos enviados.
// jsPDF se carga bajo demanda para no aumentar el tamaño inicial de la app.
export async function descargarPdf(datos: DatosProducto, origen: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Gestión de Inventario - Producto registrado', 15, 20);
  doc.setFontSize(10);
  doc.text(`Formulario: ${origen}   |   Generado: ${new Date().toLocaleString('es-ES')}`, 15, 28);
  doc.line(15, 32, 195, 32);

  const filas: [string, string][] = [
    ['Código de barras (SKU)', datos.sku],
    ['Nombre del producto', datos.nombre],
    ['Categoría', datos.categoria],
    ['Stock mínimo', String(datos.stockMinimo)],
    ['Fecha de nacimiento', new Date(datos.fechaNacimiento + 'T00:00').toLocaleDateString('es-ES')],
    ['Contraseña (SHA-256)', datos.password],
  ];

  let y = 44;
  doc.setFontSize(12);
  for (const [campo, valor] of filas) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${campo}:`, 15, y);
    doc.setFont('helvetica', 'normal');
    const lineas = doc.splitTextToSize(valor, 120);
    doc.text(lineas, 75, y);
    y += 10 * lineas.length;
  }

  doc.save(`producto-${datos.sku}.pdf`);
}
