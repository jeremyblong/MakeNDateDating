const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");
const config = require("config");
const { v4: uuidv4 } = require('uuid');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: config.get("openAIAPIKey")
});

const openai = new OpenAIApi(configuration);


router.post("/", async (req, resppppp) => {

    const { message } = req.body;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: null
    });

    resppppp.json({
        message: "Successfully generated/submitted response!",
        text: completion.data.choices[0].text
    })
});

module.exports = router;