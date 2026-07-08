export interface PreviewCierre {
  fechaApertura: string;
  fechaActual: string;
  totalEfectivo: number;
  totalTarjeta: number;
  totalNequi: number;
  totalDaviplata: number;
  totalTransferencia: number;
  totalOtros: number;
  totalPropinas: number;
  totalGeneral: number;
  pedidosAtendidos: number;
  pedidosCancelados: number;
}

export interface CierreCaja {
  id: number;
  cajeroNombre: string | null;
  fechaApertura: string;
  fechaCierre: string;
  totalEfectivo: number;
  totalTarjeta: number;
  totalNequi: number;
  totalDaviplata: number;
  totalTransferencia: number;
  totalOtros: number;
  totalPropinas: number;
  totalGeneral: number;
  efectivoContado: number | null;
  diferencia: number | null;
  pedidosAtendidos: number;
  pedidosCancelados: number;
  notas: string | null;
}

export interface CerrarCajaRequest {
  efectivoContado?: number | null;
  notas?: string;
}
