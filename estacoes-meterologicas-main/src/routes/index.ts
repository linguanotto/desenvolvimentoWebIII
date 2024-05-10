// routes.ts
import express from "express";
import { EstacaoModel } from "../models/Estacao";
import EstacaoController from "../controllers/EstacaoController";

const router = express.Router();

// Rota para retornar os campos uf, estacao, latitude e longitude de todas as estações ordenadas pelo campo estacao
router.get("/estacao/lista", async (req, res) => {
  try {
    // Consulta ao banco de dados usando o modelo Estacao
    const estacoes = await EstacaoModel.find(
      {},
      { uf: 1, estacao: 1, latitude: 1, longitude: 1, _id: 0 }
    ).sort({ estacao: 1 });

    // Retorna os dados obtidos na consulta como resposta
    res.json(estacoes);
  } catch (err: any) {
    // Definindo o tipo de err como Error
    // Em caso de erro, retorna um código de status 500 e a mensagem de erro
    res.status(500).json({ message: err.message });
  }
});

// Rota para retornar a quantidade de leituras por estação, ordenada pelo campo estacao
router.get("/estacao/leiturasporestacao", async (req, res) => {
  try {
    // Agregação no banco de dados usando o modelo Estacao
    const leiturasPorEstacao = await EstacaoModel.aggregate([
      {
        $project: {
          _id: 0,
          estacao: 1,
          quantidade: { $size: "$leituras" },
        },
      },
      {
        $sort: { estacao: 1 },
      },
    ]);

    // Retorna os dados obtidos na agregação como resposta
    res.json(leiturasPorEstacao);
  } catch (err: any) {
    // Definindo o tipo de err como Error
    // Em caso de erro, retorna um código de status 500 e a mensagem de erro
    res.status(500).json({ message: err.message });
  }
});

// Rota para retornar a média, a mínima e a máxima temperatura do ar de uma estação
router.get("/estacao/estatisticatemperatura/:nomeEstacao", async (req, res) => {
  const nomeEstacao = req.params.nomeEstacao;

  try {
    // Agregação no banco de dados usando o modelo Estacao
    const estatisticasTemperatura = await EstacaoModel.aggregate([
      // Estágio $match para filtrar as leituras da estação especificada
      {
        $match: { estacao: nomeEstacao },
      },
      // Estágio $unwind para "desconstruir" o array leituras em documentos individuais
      {
        $unwind: "$leituras",
      },
      // Estágio $group para agrupar pelo campo estacao e calcular a média, o mínimo e o máximo da temperaturaAr
      {
        $group: {
          _id: "$estacao",
          Media: { $avg: "$leituras.temperaturaAr" },
          Minima: { $min: "$leituras.temperaturaAr" },
          Maxima: { $max: "$leituras.temperaturaAr" },
        },
      },
      // Estágio $project para projetar os campos desejados
      {
        $project: {
          _id: 0, // Removendo o campo _id
          estacao: "$_id",
          Media: 1,
          Minima: 1,
          Maxima: 1,
        },
      },
    ]);

    // Retorna as estatísticas de temperatura obtidas na agregação como resposta
    res.json(estatisticasTemperatura);
  } catch (err: any) {
    // Definindo o tipo de err como Error
    // Em caso de erro, retorna um código de status 500 e a mensagem de erro
    res.status(500).json({ message: err.message });
  }
});
// Rota para retornar todas as leituras no intervalo de datas fornecido para uma estação
router.get("/estacao/intervalo/:nomeEstacao/:dataInicio/:dataFim", async (req, res) => {
  const nomeEstacao = req.params.nomeEstacao;
  const dataInicio = new Date(req.params.dataInicio);
  const dataFim = new Date(req.params.dataFim);

  try {
    const leiturasIntervalo = await EstacaoController.getIntervalo(nomeEstacao, dataInicio, dataFim);
    res.json(leiturasIntervalo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
