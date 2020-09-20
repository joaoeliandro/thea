const express = require("express");
const cors = require("cors");

const zenvia = require("./services/zenvia");

const app = express();

app.use(cors());


app.get("/", (request, response) => {
  return response.json({ message: "Hello World!" });
});

app.get("/send", async (request, response) => {
  const { message } = request.query;

  const result = await zenvia.sendMessage(message);

  return response.json(result);
});

app.listen(3333, () => {
  console.log("Server started!");
});

zenvia.receiveMessage("https://webhook.site/4a5589fc-7776-4a4e-9ce7-75b6f953f538");
