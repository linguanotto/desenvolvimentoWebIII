import fs from "fs-extra";
import { Estacao } from "../types";
import { connect, disconnect } from "../models/connection";
import controller from "./EstacaoController";
// Pasta onde estão os arquivos CSV
const pasta = "./dados";
function getDataFundacao(data: string) {
try {
const temp = data.split("/");
return new Date(
Date.UTC(
parseInt("20" + temp[2]),
parseInt(temp[1]) - 1,
parseInt(temp[0])
)
);
} catch (e: any) {
return undefined;
}
}
function getDataHorario(data: string, hora: string): Date | undefined {
try {
const temp = data.split("/");
const h = parseInt(hora.substring(0, 2));
const m = parseInt(hora.substring(2, 4));
return new Date(
Date.UTC(
parseInt(temp[0]),
parseInt(temp[1]) - 1,parseInt(temp[2]),
h,
m,
0
)
);
} catch (e: any) {
return undefined;
}
}
function getValue(input: string): number | undefined {
const value = parseFloat(input.replace(",", "."));
return isNaN(value) ? undefined : value;
}
// Função para ler arquivos CSV na pasta
async function lerArquivosCSV(): Promise<void> {
// Objeto usado para manter os dados de um arquivo CSV
let estacao: Estacao;
try {
// Obtém uma lista de todos os arquivos na pasta
const files = await fs.readdir(pasta);
let count = 1;
// Para cada arquivo na pasta
for (const file of files) {
estacao = {} as Estacao;
try {
// Verifica se é um arquivo CSV
if (file.endsWith(".CSV")) {
// Caminho completo do arquivo
const filePath = `${pasta}/${file}`;
// Lê o conteúdo do arquivo CSV
const fileContent = await fs.readFile(filePath, "utf8");
// Divide o conteúdo do arquivo em linhas
const linhasCSV = fileContent.split("\n");
// Parse do conteúdo CSV linha por linha
for (let i = 0, linha; i < linhasCSV.length; i++) {
linha = linhasCSV[i].split(";");
if (linha.length >= 2 && linha[0] === "REGIAO:") {
estacao.regiao = linha[1];
} else if (linha.length >= 2 && linha[0] === "UF:") {
estacao.uf = linha[1];
} else if (linha.length >= 2 && linha[0] === "ESTACAO:") {
estacao.estacao = linha[1];
} else if (linha.length >= 2 && linha[0] === "CODIGO (WMO):") {
estacao.codigo = linha[1];
} else if (linha.length >= 2 && linha[0] === "LATITUDE:") {estacao.latitude = getValue(linha[1]);
} else if (linha.length >= 2 && linha[0] === "LONGITUDE:") {
estacao.longitude = getValue(linha[1]);
} else if (linha.length >= 2 && linha[0] === "ALTITUDE:") {
estacao.altitude = getValue(linha[1]);
} else if (linha.length >= 2 && linha[0] === "DATA DE FUNDACAO:") {
estacao.dataFundacao = getDataFundacao(linha[1]);
} else if (linha.length >= 20 && !linha[0].startsWith("Data")) {
if( !estacao.leituras ){
estacao.leituras = [];
}
estacao.leituras.push({
datahora: getDataHorario(linha[0], linha[1]),
precipitacao: getValue(linha[2]),
pressaoAtmNivel: getValue(linha[3]),
pressaoAtmMax: getValue(linha[4]),
pressaoAtmMin: getValue(linha[5]),
radiacao: getValue(linha[6]),
temperaturaAr: getValue(linha[7]),
temperaturaOrvalho: getValue(linha[8]),
temperaturaMax: getValue(linha[9]),
temperaturaMin: getValue(linha[10]),
temperaturaOrvalhoMax: getValue(linha[11]),
temperaturaOrvalhoMin: getValue(linha[12]),
umidadeRelativaMax: getValue(linha[13]),
umidadeRelativaMin: getValue(linha[14]),
umidadeRelativa: getValue(linha[15]),
ventoDirecao: getValue(linha[16]),
ventoRajada: getValue(linha[17]),
ventoVelocidade: getValue(linha[18]),
});
}
}
// cada arquivo será um documento na coleção
await controller.insert(estacao);
console.log(`${count++} - ${estacao.estacao}`);
}
} catch (e: any) {
console.log(`Erro no arquivo ${file}`);
}
}
} catch (err: any) {
console.error("Erro ao ler a pasta:", err.message);
}
}
// conecta ao MongoDB antes de escrever
connect();

// Chama a função para ler os arquivos CSV
lerArquivosCSV().finally(async () => await disconnect());