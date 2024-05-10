import mongoose from "mongoose";

// A URI indica o IP, a porta e BD a ser conectado
const uri = "mongodb://127.0.0.1:27017/bdmeteorologico";

// Salva o objeto mongoose em uma variável
const db = mongoose;

export function connect() {
  // Utiliza o método connect do Mongoose para estabelecer a conexão com o MongoDB, usando a URI
  db.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    maxPoolSize: 10,
  })
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((e) => {
      console.error("Erro ao conectar ao MongoDB:", e.message);
    });
  // o sinal SIGINT é disparado ao encerrar a aplicação, geralmente, usando Crtl+C
  process.on("SIGINT", async () => {
    try {
      console.log("Conexão com o MongoDB fechada");
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error("Erro ao fechar a conexão com o MongoDB:", error);
      process.exit(1);
    }
  });
}
export async function disconnect() {
  console.log("Conexão com o MongoDB encerrada");
  await db.disconnect();
}
