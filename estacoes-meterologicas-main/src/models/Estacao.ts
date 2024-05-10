import mongoose from "mongoose";

const { Schema } = mongoose;
const LeituraSchema = new Schema({
  datahora: Date,
  precipitacao: Number,
  pressaoAtmNivel: Number,
  pressaoAtmMax: Number,
  pressaoAtmMin: Number,
  radiacao: Number,
  temperaturaAr: Number,
  temperaturaOrvalho: Number,
  temperaturaMax: Number,
  temperaturaMin: Number,
  temperaturaOrvalhoMax: Number,
  temperaturaOrvalhoMin: Number,
  umidadeRelativaMax: Number,
  umidadeRelativaMin: Number,
  umidadeRelativa: Number,
  ventoDirecao: Number,
  ventoRajada: Number,
  ventoVelocidade: Number,
});
// define os schemas
const EstacaoSchema = new Schema({
  regiao: String,
  uf: String,
  estacao: String,
  codigo: String,
  latitude: Number,
  longitude: Number,
  altitude: Number,
  dataFundacao: Date,
  leituras: [LeituraSchema],
});
// mongoose.model compila o modelo
const LeituraModel = mongoose.model("Leitura", LeituraSchema);
const EstacaoModel = mongoose.model("Estacao", EstacaoSchema, "estacoes");
export { LeituraModel, EstacaoModel };
