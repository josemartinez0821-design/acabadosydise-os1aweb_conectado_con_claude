// Exportación real de Reportes a PNG/PDF/Word. PNG y PDF son una captura visual del reporte
// (html2canvas → jsPDF) para que se vea igual a lo que el admin tiene en pantalla, gráfica
// incluida. Word usa `docx` para armar un documento de datos editable (tablas), no una imagen —
// esa librería no maneja bien incrustar el SVG de la gráfica.
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType } from 'docx'

function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function capturarElemento(el) {
  return html2canvas(el, { backgroundColor: '#ffffff', scale: 2, useCORS: true })
}

export function useReporteExport() {
  async function exportarPNG(el, nombreArchivo) {
    const canvas = await capturarElemento(el)
    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        descargarBlob(blob, `${nombreArchivo}.png`)
        resolve()
      }, 'image/png')
    })
  }

  async function exportarPDF(el, nombreArchivo) {
    const canvas = await capturarElemento(el)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let alturaRestante = imgHeight
    let posicionY = 0
    pdf.addImage(imgData, 'PNG', 0, posicionY, imgWidth, imgHeight)
    alturaRestante -= pageHeight
    while (alturaRestante > 0) {
      posicionY = alturaRestante - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, posicionY, imgWidth, imgHeight)
      alturaRestante -= pageHeight
    }
    pdf.save(`${nombreArchivo}.pdf`)
  }

  // datos = { titulo, rangoTexto, stats: [{label,valor}], productos: [{nombre,categoria,unidades,ingresos}],
  //           promociones: [{titulo,tipo,vigencia,estado}] }
  async function exportarWord(datos, nombreArchivo) {
    const filaTabla = (celdas, esEncabezado = false) =>
      new TableRow({
        children: celdas.map(
          (texto) =>
            new TableCell({
              width: { size: 100 / celdas.length, type: WidthType.PERCENTAGE },
              shading: esEncabezado ? { fill: 'F5F5F5' } : undefined,
              children: [new Paragraph({ children: [new TextRun({ text: String(texto), bold: esEncabezado })] })],
            })
        ),
      })

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: datos.titulo, heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: datos.rangoTexto, spacing: { after: 300 } }),

            new Paragraph({ text: 'Resumen', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [filaTabla(['Indicador', 'Valor'], true), ...datos.stats.map((s) => filaTabla([s.label, s.valor]))],
            }),

            new Paragraph({ text: 'Productos más vendidos', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                filaTabla(['#', 'Producto', 'Categoría', 'Unidades', 'Ingresos'], true),
                ...datos.productos.map((p, i) => filaTabla([i + 1, p.nombre, p.categoria, p.unidades, p.ingresos])),
              ],
            }),

            new Paragraph({ text: 'Promociones', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                filaTabla(['Título', 'Tipo', 'Vigencia', 'Estado'], true),
                ...datos.promociones.map((p) => filaTabla([p.titulo, p.tipo, p.vigencia, p.estado])),
              ],
            }),
          ],
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    descargarBlob(blob, `${nombreArchivo}.docx`)
  }

  return { exportarPNG, exportarPDF, exportarWord }
}
