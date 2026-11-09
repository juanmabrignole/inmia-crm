// Mapeo de una propiedad de Inmia al cuerpo de POST /items de Mercado Libre (inmuebles).
// Solo se usan IDs confirmados en la documentación oficial (ejemplo de "Publica Inmuebles").
// Lo que falte o no se pueda mapear se informa en `faltantes` y no se inventa.

type PropiedadML = {
  direccion: string;
  tipo: string | null;
  operacion: string;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_m2: number | null;
  cochera: boolean;
  descripcion: string | null;
  precio_venta: number | null;
  moneda_venta: string;
};

type FotoML = { url: string; orden: number | null };
type AsesorML = { nombre: string; email: string | null; telefono: string | null } | null;

// Categoría de departamentos en venta (ejemplo oficial). Verificar antes de publicar en producción.
const CATEGORIA_DEPARTAMENTO_VENTA = 'MLA401686';

// value_id confirmados en la documentación oficial.
const PROPERTY_TYPE_DEPARTAMENTO = { id: '242062', name: 'Departamento' };
const OPERATION_VENTA = { id: '242075', name: 'Venta' };
const OPERATION_SUBTYPE_INDIVIDUAL = { id: '244562', name: 'Propiedad individual' };

const soloDigitos = (v: string | null | undefined) => (v ?? '').replace(/\D/g, '');

export type ResultadoML = {
  payload: Record<string, unknown>;
  faltantes: string[];
  advertencias: string[];
};

export function propiedadAMercadoLibre(p: PropiedadML, fotos: FotoML[], asesor: AsesorML): ResultadoML {
  const faltantes: string[] = [];
  const advertencias: string[] = [];

  const esDepto = (p.tipo ?? '').toLowerCase().includes('depart');
  if (p.operacion !== 'venta') faltantes.push('Por ahora solo se publican propiedades en venta. El alquiler falta verificar la categoría.');
  if (!esDepto) faltantes.push('Tipo de inmueble sin mapear. Por ahora solo departamentos.');
  if (p.precio_venta == null) faltantes.push('Falta el precio de venta.');
  if (p.superficie_m2 == null) faltantes.push('Falta la superficie.');
  if (p.ambientes == null) faltantes.push('Faltan los ambientes.');
  if (p.dormitorios == null) faltantes.push('Faltan los dormitorios.');
  if (p.banos == null) faltantes.push('Faltan los baños.');

  const fotosOrdenadas = [...fotos].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  if (!fotosOrdenadas.length) faltantes.push('Falta al menos una foto (Mercado Libre la exige).');

  if (!asesor?.telefono || !soloDigitos(asesor.telefono)) {
    faltantes.push('Falta el teléfono del asesor (se usa para el WhatsApp del aviso).');
  }

  faltantes.push('Faltan coordenadas y barrio de Mercado Libre (location). Se resuelven con la API de localización.');

  if (p.moneda_venta !== 'ARS') advertencias.push('Verificar que Mercado Libre acepte la moneda de la propiedad para inmuebles.');

  const titulo = `${esDepto ? 'Departamento' : p.tipo ?? 'Inmueble'} en venta${p.ambientes ? `, ${p.ambientes} amb.` : ''} ${p.direccion}`.slice(0, 60);

  const attributes = [
    p.ambientes != null && { id: 'ROOMS', value_name: String(p.ambientes) },
    p.dormitorios != null && { id: 'BEDROOMS', value_name: String(p.dormitorios) },
    p.banos != null && { id: 'FULL_BATHROOMS', value_name: String(p.banos) },
    { id: 'PARKING_LOTS', value_name: p.cochera ? '1' : '0' },
    p.superficie_m2 != null && { id: 'COVERED_AREA', value_name: `${p.superficie_m2} m²` },
    p.superficie_m2 != null && { id: 'TOTAL_AREA', value_name: `${p.superficie_m2} m²` },
    esDepto && { id: 'PROPERTY_TYPE', value_id: PROPERTY_TYPE_DEPARTAMENTO.id, value_name: PROPERTY_TYPE_DEPARTAMENTO.name },
    { id: 'OPERATION', value_id: OPERATION_VENTA.id, value_name: OPERATION_VENTA.name },
    { id: 'OPERATION_SUBTYPE', value_id: OPERATION_SUBTYPE_INDIVIDUAL.id, value_name: OPERATION_SUBTYPE_INDIVIDUAL.name }
  ].filter(Boolean);

  const telefono = soloDigitos(asesor?.telefono);

  const payload = {
    title: titulo,
    category_id: esDepto ? CATEGORIA_DEPARTAMENTO_VENTA : null,
    buying_mode: 'classified',
    listing_type_id: 'silver',
    channels: ['marketplace'],
    condition: 'not_specified',
    available_quantity: 1,
    currency_id: p.moneda_venta,
    price: p.precio_venta,
    description: { plain_text: p.descripcion ?? '' },
    attributes,
    location: { address_line: p.direccion },
    pictures: fotosOrdenadas.map((f) => ({ source: f.url })),
    seller_contact: {
      contact: asesor?.nombre ?? '',
      email: asesor?.email ?? '',
      other_info: '',
      webpage: '',
      country_code: '54',
      area_code: '',
      phone: telefono,
      country_code2: '54',
      phone2: telefono
    }
  };

  return { payload, faltantes, advertencias };
}
