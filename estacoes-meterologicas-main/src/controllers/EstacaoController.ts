// EstacaoController.ts
import { EstacaoModel } from "../models/Estacao";
import { Estacao } from "../types";

class EstacaoController {
  // Insere um documento na coleção estacoes
  public async insert(estacao: Estacao): Promise<void> {
    try {
      const document = new EstacaoModel(estacao);
      await document.save(); // insere na coleção
    } catch (error: any) {
      console.log(estacao.estacao, error.message);
    }
  }

  // Retorna todas as leituras no intervalo de datas fornecido para uma estação
  public async getIntervalo(nomeEstacao: string, dataInicio: Date, dataFim: Date): Promise<any> {
    try {
      const result = await EstacaoModel.aggregate([
        {
          $match: { estacao: nomeEstacao }
        },
        {
          $unwind: "$leituras"
        },
        {
          $match: { "leituras.datahora": { $gte: dataInicio, $lte: dataFim } }
        },
        {
          $group: {
            _id: "$estacao",
            leituras: {
              $push: {
                data: "$leituras.datahora",
                precipitacao: "$leituras.precipitacao",
                temperaturaAr: "$leituras.temperaturaAr",
                umidadeRelativa: "$leituras.umidadeRelativa",
                ventoDirecao: "$leituras.ventoDirecao",
                ventoVelocidade: "$leituras.ventoVelocidade"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            estacao: "$_id",
            leituras: 1
          }
        }
      ]);
      return result;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default new EstacaoController();
