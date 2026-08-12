// Paleta de colores para el selector de pinturas/vinilos (inspirado en selectores tipo Pintuco,
// con estilo propio). No corresponde a una tabla real de la BD: `productos.color` es solo un
// VARCHAR con el nombre del color, sin familia ni código. Esta paleta es una referencia de la
// tienda (los colores se preparan a pedido), independiente de qué producto puntual se esté viendo.
// Los códigos (NE-01, CA-05, etc.) son un esquema propio, no los códigos reales de ningún fabricante.
// TODO backend: si se quiere persistir esto, se necesitaría una tabla `familias_color`
// (id, nombre) y `colores` (id, id_familia, nombre, codigo, hex) en vez de vivir solo en el frontend.

export const FAMILIAS_COLOR = [
  {
    id: 'neutros',
    nombre: 'Neutros',
    icono: 'ri-contrast-2-line',
    colores: [
      { codigo: 'NE-01', nombre: 'Blanco Nube', hex: '#FFFFFF' },
      { codigo: 'NE-02', nombre: 'Blanco Puro', hex: '#FBFBF9' },
      { codigo: 'NE-03', nombre: 'Blanco Hueso', hex: '#F5F0E6' },
      { codigo: 'NE-04', nombre: 'Blanco Marfil', hex: '#F2EAD8' },
      { codigo: 'NE-05', nombre: 'Blanco Perla', hex: '#EFEAE1' },
      { codigo: 'NE-06', nombre: 'Gris Claro', hex: '#E3E1DC' },
      { codigo: 'NE-07', nombre: 'Gris Niebla', hex: '#CFCDC7' },
      { codigo: 'NE-08', nombre: 'Gris Paloma', hex: '#C4C1BA' },
      { codigo: 'NE-09', nombre: 'Gris Perla', hex: '#D9D9D6' },
      { codigo: 'NE-10', nombre: 'Gris Plata', hex: '#B7B5AE' },
      { codigo: 'NE-11', nombre: 'Gris Medio', hex: '#ABA9A3' },
      { codigo: 'NE-12', nombre: 'Gris Piedra', hex: '#9C9A93' },
      { codigo: 'NE-13', nombre: 'Gris Concreto', hex: '#8B8983' },
      { codigo: 'NE-14', nombre: 'Gris Plomo', hex: '#757369' },
      { codigo: 'NE-15', nombre: 'Gris Pizarra', hex: '#656258' },
      { codigo: 'NE-16', nombre: 'Gris Carbón', hex: '#5A5854' },
      { codigo: 'NE-17', nombre: 'Gris Antracita', hex: '#3A3937' },
      { codigo: 'NE-18', nombre: 'Negro Grafito', hex: '#2B2B2B' },
      { codigo: 'NE-19', nombre: 'Negro Profundo', hex: '#1C1C1C' },
      { codigo: 'NE-20', nombre: 'Negro Total', hex: '#141414' },
    ],
  },
  {
    id: 'calidos',
    nombre: 'Cálidos',
    icono: 'ri-sun-line',
    colores: [
      { codigo: 'CA-01', nombre: 'Durazno Claro', hex: '#F0C4A0' },
      { codigo: 'CA-02', nombre: 'Durazno', hex: '#E8A87C' },
      { codigo: 'CA-03', nombre: 'Melocotón', hex: '#E39B6E' },
      { codigo: 'CA-04', nombre: 'Coral', hex: '#E17A5A' },
      { codigo: 'CA-05', nombre: 'Salmón', hex: '#D97B63' },
      { codigo: 'CA-06', nombre: 'Terracota Suave', hex: '#D19A76' },
      { codigo: 'CA-07', nombre: 'Terracota', hex: '#C1633D' },
      { codigo: 'CA-08', nombre: 'Ladrillo Claro', hex: '#B85443' },
      { codigo: 'CA-09', nombre: 'Ladrillo', hex: '#A8442E' },
      { codigo: 'CA-10', nombre: 'Rojo Óxido', hex: '#8C3A28' },
      { codigo: 'CA-11', nombre: 'Rojo Teja', hex: '#7A2E1F' },
      { codigo: 'CA-12', nombre: 'Amarillo Dorado', hex: '#E5B93A' },
      { codigo: 'CA-13', nombre: 'Mostaza', hex: '#D4A017' },
      { codigo: 'CA-14', nombre: 'Ocre Cálido', hex: '#C68A2E' },
      { codigo: 'CA-15', nombre: 'Naranja Quemado', hex: '#C1662A' },
      { codigo: 'CA-16', nombre: 'Café Canela', hex: '#7A4B32' },
      { codigo: 'CA-17', nombre: 'Café Espresso', hex: '#5A4632' },
      { codigo: 'CA-18', nombre: 'Café Tostado', hex: '#4E3928' },
      { codigo: 'CA-19', nombre: 'Café Chocolate', hex: '#3E2B1F' },
      { codigo: 'CA-20', nombre: 'Café Oscuro', hex: '#2E2015' },
    ],
  },
  {
    id: 'frios',
    nombre: 'Fríos',
    icono: 'ri-drop-line',
    colores: [
      { codigo: 'FR-01', nombre: 'Azul Hielo', hex: '#DCEBF5' },
      { codigo: 'FR-02', nombre: 'Azul Cielo', hex: '#C7DDEE' },
      { codigo: 'FR-03', nombre: 'Azul Pastel', hex: '#A9C6DC' },
      { codigo: 'FR-04', nombre: 'Azul Grisáceo', hex: '#8FADC2' },
      { codigo: 'FR-05', nombre: 'Azul Medio', hex: '#5C8AB0' },
      { codigo: 'FR-06', nombre: 'Azul Rey', hex: '#2E5C8A' },
      { codigo: 'FR-07', nombre: 'Azul Marino', hex: '#1F3A5F' },
      { codigo: 'FR-08', nombre: 'Azul Noche', hex: '#142943' },
      { codigo: 'FR-09', nombre: 'Verde Menta', hex: '#A8D5BA' },
      { codigo: 'FR-10', nombre: 'Verde Agua Frío', hex: '#8FC9AE' },
      { codigo: 'FR-11', nombre: 'Verde Salvia', hex: '#8CAE8E' },
      { codigo: 'FR-12', nombre: 'Verde Esmeralda', hex: '#2E7D5B' },
      { codigo: 'FR-13', nombre: 'Verde Botella', hex: '#2F5233' },
      { codigo: 'FR-14', nombre: 'Verde Bosque', hex: '#1E3B23' },
      { codigo: 'FR-15', nombre: 'Verde Pino', hex: '#16301C' },
      { codigo: 'FR-16', nombre: 'Lavanda', hex: '#C3B1E1' },
      { codigo: 'FR-17', nombre: 'Lila', hex: '#A98FCB' },
      { codigo: 'FR-18', nombre: 'Morado Uva', hex: '#6C4A85' },
      { codigo: 'FR-19', nombre: 'Morado Berenjena', hex: '#4B2E5A' },
      { codigo: 'FR-20', nombre: 'Gris Azulado', hex: '#6C7A89' },
    ],
  },
  {
    id: 'pasteles',
    nombre: 'Pasteles',
    icono: 'ri-flower-line',
    colores: [
      { codigo: 'PA-01', nombre: 'Rosa Palo', hex: '#E8C4C4' },
      { codigo: 'PA-02', nombre: 'Rosa Cuarzo', hex: '#F0D6D6' },
      { codigo: 'PA-03', nombre: 'Rosa Bebé', hex: '#F5DDE0' },
      { codigo: 'PA-04', nombre: 'Amarillo Vainilla', hex: '#F5E1A4' },
      { codigo: 'PA-05', nombre: 'Amarillo Manteca', hex: '#F7EAC0' },
      { codigo: 'PA-06', nombre: 'Amarillo Pastel', hex: '#FBF0C9' },
      { codigo: 'PA-07', nombre: 'Verde Agua', hex: '#C7E8E0' },
      { codigo: 'PA-08', nombre: 'Verde Pistacho', hex: '#D4E8C4' },
      { codigo: 'PA-09', nombre: 'Verde Menta Suave', hex: '#D6EDDD' },
      { codigo: 'PA-10', nombre: 'Azul Bebé', hex: '#C9E4F5' },
      { codigo: 'PA-11', nombre: 'Celeste Suave', hex: '#DCEEF7' },
      { codigo: 'PA-12', nombre: 'Azul Polvo', hex: '#CBD9E8' },
      { codigo: 'PA-13', nombre: 'Lila Suave', hex: '#E0D4EC' },
      { codigo: 'PA-14', nombre: 'Lavanda Pastel', hex: '#E6DCF0' },
      { codigo: 'PA-15', nombre: 'Durazno Suave', hex: '#F5D6C6' },
      { codigo: 'PA-16', nombre: 'Melón Pastel', hex: '#F7DCC8' },
      { codigo: 'PA-17', nombre: 'Beige Rosado', hex: '#EAD9CE' },
      { codigo: 'PA-18', nombre: 'Gris Perlado', hex: '#E5E1DC' },
      { codigo: 'PA-19', nombre: 'Blanco Crema', hex: '#FAF3E3' },
      { codigo: 'PA-20', nombre: 'Coral Pastel', hex: '#F0C9BE' },
    ],
  },
  {
    id: 'tierra',
    nombre: 'Tierra',
    icono: 'ri-plant-line',
    colores: [
      { codigo: 'TI-01', nombre: 'Arena Clara', hex: '#E4D9BC' },
      { codigo: 'TI-02', nombre: 'Arena', hex: '#D9C9A3' },
      { codigo: 'TI-03', nombre: 'Beige Cálido', hex: '#D8C3A5' },
      { codigo: 'TI-04', nombre: 'Beige Tostado', hex: '#C9AF87' },
      { codigo: 'TI-05', nombre: 'Ocre Claro', hex: '#C79A45' },
      { codigo: 'TI-06', nombre: 'Ocre', hex: '#B8860B' },
      { codigo: 'TI-07', nombre: 'Ocre Tostado', hex: '#A9762F' },
      { codigo: 'TI-08', nombre: 'Terracota Tierra', hex: '#C17A4E' },
      { codigo: 'TI-09', nombre: 'Siena', hex: '#9C5A32' },
      { codigo: 'TI-10', nombre: 'Siena Tostada', hex: '#8A4E2C' },
      { codigo: 'TI-11', nombre: 'Café Tierra', hex: '#6B4A2F' },
      { codigo: 'TI-12', nombre: 'Café Oscuro', hex: '#4A3320' },
      { codigo: 'TI-13', nombre: 'Café Profundo', hex: '#3A2818' },
      { codigo: 'TI-14', nombre: 'Musgo Claro', hex: '#8D8654' },
      { codigo: 'TI-15', nombre: 'Musgo', hex: '#7A7248' },
      { codigo: 'TI-16', nombre: 'Verde Oliva', hex: '#6E6B3A' },
      { codigo: 'TI-17', nombre: 'Oliva Oscuro', hex: '#575431' },
      { codigo: 'TI-18', nombre: 'Marrón Rojizo', hex: '#7C4433' },
      { codigo: 'TI-19', nombre: 'Marrón Tostado', hex: '#6E3A28' },
      { codigo: 'TI-20', nombre: 'Marrón Profundo', hex: '#52281B' },
    ],
  },
]

// Lista plana de los 100 colores, usada por la pestaña "Buscar" del selector.
export const TODOS_LOS_COLORES = FAMILIAS_COLOR.flatMap((f) =>
  f.colores.map((c) => ({ ...c, familiaId: f.id, familiaNombre: f.nombre }))
)

export function buscarColorPorNombre(nombre) {
  if (!nombre) return null
  const term = nombre.trim().toLowerCase()
  for (const familia of FAMILIAS_COLOR) {
    const color = familia.colores.find((c) => c.nombre.toLowerCase() === term)
    if (color) return { ...color, familiaId: familia.id }
  }
  // Sin coincidencia exacta (ej. "Blanco" vs "Blanco Nube"): busca la primera que comparta palabra.
  for (const familia of FAMILIAS_COLOR) {
    const color = familia.colores.find((c) => {
      const cNombre = c.nombre.toLowerCase()
      return cNombre.includes(term) || term.includes(cNombre.split(' ')[0])
    })
    if (color) return { ...color, familiaId: familia.id }
  }
  return null
}
