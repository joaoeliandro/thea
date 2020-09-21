require("dotenv/config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const zenvia = require("./services/zenvia");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (request, response) => {
  return response.json({ message: "Hello World!" });
});

app.post("/send-message", async (request, response) => {
  const { message } = request.body;

  if (message === "init") {
    zenvia.receiveMessage(process.env.URLWEBHOOK);

    return response.send("ok");
  }

  else {
    const result = await zenvia.sendMessage(message);

    return response.json(result);
  }
});

app.listen(3333, () => {
  console.log("Server started!");
});

