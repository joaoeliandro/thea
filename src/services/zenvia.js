const ngrok = require("ngrok");
const { Client, TextContent, WebhookController } = require("@zenvia/sdk");

const port = 3000;
const token = "FdUmxhH9x3FiJ76H9FLZvzy0WQl6S2m1Eh_y";
const channel = "whatsapp";

const client = new Client(token);

const whatsapp = client.getChannel(channel);

function sendMessage(message) {
  const content = new TextContent(message);

  return whatsapp.sendMessage('unruly-trip',
    '5584981599453', content)
    .then(response => response)
    .catch(error => error);
};

const url = (async () => await ngrok.connect(port))();

async function receiveMessage(url) {

  url = await url;
  console.log(`Iniciando a aplicação na porta ${port}, usando para webhook a URL: ${url}`);

  const webhook = new WebhookController({
    port,
    client,
    channel,
    url,
    messageEventHandler: (messageEvent) => {
      const phone = messageEvent.message.from;
      const senderId = messageEvent.message.to;
      let firstName;
      let reply;

      messageEvent.message.contents.forEach(content => {
        switch (content.type) {

          // Caso o usuário tenha enviado uma mensagem texto
          case 'text':
            const text = content.text;
            console.log(`O número "${phone}" enviou a mensagem: "${text}"`);

            // Tendo o nome do usuário disponível, personalizamos a resposta
            if (firstName) {
              reply = `${firstName}, obrigado pela mensagem enviada!`;
            } else {
              reply = 'Obrigado pela mensagem enviada!';
            }
            break;

          // Caso o usuário tenha enviado um arquivo, imagem, vídeo ou áudio
          case 'file':
            const url = content.fileUrl;
            const type = content.fileType;
            console.log(`O número "${phone}" enviou um arquivo do tipo "${type}": "${url}"`);

            // Tendo o nome do usuário disponível, personalizamos a resposta
            if (firstName) {
              reply = `${firstName}, obrigado pelo arquivo enviado!`;
            } else {
              reply = 'Obrigado pelo arquivo enviado!';
            }
            break;

          /* Caso tenha dados do usuário disponível.
            Normalmente tem, mas o usuário pode desabilitar isso. */
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
  });

  webhook.on('error', (error) => {
    console.error('Error:', error);
  });

  webhook.init();
}

module.exports = { sendMessage, receiveMessage };
