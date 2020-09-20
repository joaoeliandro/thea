const express = require("express");
const zenvia = require("./services/zenvia");

const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Hello World!" });
});

app.get("/send", async (request, response) => {
  const { message } = request.query;

  const result = await zenvia.sendMessage(message);

  console.log(result);
});

app.listen(3333, () => {
  console.log("Server started!");
});
