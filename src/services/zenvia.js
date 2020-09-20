const { Client, TextContent, WebhookController } = require("@zenvia/sdk");

const client = new Client('FdUmxhH9x3FiJ76H9FLZvzy0WQl6S2m1Eh_y');

const whatsapp = client.getChannel('whatsapp');

function sendMessage(message) {
  const content = new TextContent(message);

  return whatsapp.sendMessage('unruly-trip',
    '5584981599453', content)
    .then(response => response)
    .catch(error => error);
};

function receiveMessage() {
  const webhook = new WebhookController({
    messageEventHandler: (messageEvent) => {
      console.log('Message event:', messageEvent);
    },
    messageStatusEventHandler: (messageStatusEvent) => {
      console.log('Message status event:', messageStatusEvent);
    },
    client,
    url: 'https://webhook.site/4a5589fc-7776-4a4e-9ce7-75b6f953f538',
    channel: 'whatsapp',
  });

  webhook.on('listening', () => {
    console.log('Webhook is listening');
  });
  
  webhook.on('error', (error) => {
    console.error('Error:', error);
  });
  
  webhook.init();
}

module.exports = { sendMessage, receiveMessage };
