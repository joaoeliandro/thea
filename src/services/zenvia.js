require("dotenv/config");
const ngrok = require("ngrok");
const { Client, TextContent, WebhookController } = require("@zenvia/sdk");

const port = process.env.PORTZENVIA;
const token = process.env.TOKEN;
const channel = process.env.CHANNEL;
const numberRecipient = process.env.RECIPIENT;
const senderID = process.env.SENDERID;

const client = new Client(token);

const whatsapp = client.getChannel(channel);

function sendMessage(message) {
  const content = new TextContent(message);

  return whatsapp.sendMessage(senderID,
    numberRecipient, content)
    .then(response => response)
    .catch(error => error);
};

const url = (async () => await ngrok.connect(port))();

async function receiveMessage(url) {

  sendMessage("Olá, Bem vindo ao Serviço Thea!");
  sendMessage("Como posso te chamar?");

  url = await url;
  console.log(`Iniciando a aplicação na porta ${port}, usando para webhook a URL: ${url}`);

  const webhook = new WebhookController({
    port,
    messageEventHandler: (messageEvent) => {
      console.log(messageEvent)
      const phone = messageEvent.message.from;
      const senderId = messageEvent.message.to;
      let firstName;
      let reply;

      messageEvent.message.contents.forEach(content => {
        switch (content.type) {
          case 'text':
            const text = content.text;
            console.log(`O número "${phone}" enviou a mensagem: "${text}"`);

            if (firstName) {
              reply = `${firstName}, obrigado pela mensagem enviada!`;
            } else {
              reply = 'Obrigado pela mensagem enviada!';
            }
            break;

          case 'file':
            const url = content.fileUrl;
            const type = content.fileType;
            console.log(`O número "${phone}" enviou um arquivo do tipo "${type}": "${url}"`);

            if (firstName) {
              reply = `${firstName}, obrigado pelo arquivo enviado!`;
            } else {
              reply = 'Obrigado pelo arquivo enviado!';
            }
            break;

          case 'json':
            if (content.payload.visitor) {
              firstName = content.payload.visitor.firstName;
            }
            break;

          default:
            console.log(`Ignorando conteúdo do tipo "${content.type}" do número "${phone}"`);
        }

        // Envia uma resposta ao usuário
        if (reply) {
          client.getChannel(channel).sendMessage(senderId, phone, new TextContent(reply));
        }
      });

      console.log('Message event:', messageEvent);
    },
    messageStatusEventHandler: (messageStatusEvent) => {
      console.log('Message status event:', messageStatusEvent);
    },
    client,
    url,
    channel,
  });

  webhook.on('error', (error) => {
    console.error('Error:', error);
  });

  webhook.init();
}

module.exports = { sendMessage, receiveMessage };
