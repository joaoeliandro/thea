const { Client, TextContent } = require("@zenvia/sdk");

const client = new Client('FdUmxhH9x3FiJ76H9FLZvzy0WQl6S2m1Eh_y');

const whatsapp = client.getChannel('whatsapp');

function sendMessage(message) {
  const content = new TextContent(message);

  return whatsapp.sendMessage('unruly-trip',
    '5584981599453', content)
    .then(response => response)
    .catch(error => error);
};

module.exports = { sendMessage };
