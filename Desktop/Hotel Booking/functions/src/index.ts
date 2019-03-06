"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

// process.env.DEBUG = "dialogflow:debug";
const imageUrl =
  "http://www.hotel-r.net/im/hotel/asia/my/vip-hotel-segamat-1.jpg";
const linkUrl = "https://www.hotelvipclub.com/";

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const _agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Good day! What can I do for you today?`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    function roomPackage(agent) {
      agent.add(`Choose your room type`);
      agent.add(new Suggestion(`Basic room`));
      agent.add(new Suggestion(`Standard room`));
      agent.add(new Suggestion(`VIP room`));
    }

    function Hotel(agent) {
      agent.add(
        new Card({
          title: `ABC Hotel`,
          imageUrl: imageUrl,
          text: `This is our Beautifull hotel`,
          buttonText: "Go to website",
          buttonUrl: linkUrl
        })
      );
    }

    // Run the proper handler based on the matched Dialogflow intent
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);

    intentMap.set("Book a room", agent => {
      const name = agent.parameters.name;
      const persons = agent.parameters.persons;
      const email = agent.parameters.email;

      console.log(name, persons, email);
      agent.add(
        ` Thanks! ${name} your request for ${persons} persons have forwarded we will contact you on ${email} `
      );
      
    });

    intentMap.set("Room Package", roomPackage);
    intentMap.set("Hotel", Hotel);

    _agent.handleRequest(intentMap);
  }
);
