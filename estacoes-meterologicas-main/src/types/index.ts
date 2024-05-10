export interface Estacao {
  regiao: string | undefined;
  uf: string | undefined;
  estacao: string | undefined;
  codigo: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  altitude: number | undefined;
  dataFundacao: Date | undefined;
  leituras: Leitura[];
}
export interface Leitura {
  datahora: Date | undefined;
  precipitacao: number | undefined;
  pressaoAtmNivel: number | undefined;
  pressaoAtmMax: number | undefined;
  pressaoAtmMin: number | undefined;
  radiacao: number | undefined;
  temperaturaAr: number | undefined;
  temperaturaOrvalho: number | undefined;
  temperaturaMax: number | undefined;
  temperaturaMin: number | undefined;
  temperaturaOrvalhoMax: number | undefined;
  temperaturaOrvalhoMin: number | undefined;
  umidadeRelativaMax: number | undefined;
  umidadeRelativaMin: number | undefined;
  umidadeRelativa: number | undefined;
  ventoDirecao: number | undefined;
  ventoRajada: number | undefined;
  ventoVelocidade: number | undefined;
}
