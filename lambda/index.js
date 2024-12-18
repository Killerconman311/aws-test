
const Alexa = require('ask-sdk-core');
const util = require('./util');
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to the Atomic Energy skill, I can tell you more about the benefits of nuclear energy, provide info on the climate clock, or suggest ways you can help.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentItem = sessionAttributes.Positive_Aspect || 'none';

        const speakOutput = `This skill intends to help reduce the misinformation around nuclear energy. Currently, you have selected ${currentItem}. You can ask me about efficiency, emissions, and safety, check the climate clock, or ask me for ways you can help.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like to do?')
            .getResponse();
    }
};

const ExplainNuclearBenefitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExplainNuclearBenefitIntent';
    },
    handle(handlerInput) {
        const listItem = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Positive_Aspect');
        let speakOutput;

        // Provide different responses based on the selected Positive_Aspect value
        if (listItem === 'efficiency') {
            speakOutput = 'Nuclear energy is highly efficient, with a small amount of uranium producing a large amount of energy. This efficiency reduces the need for frequent resource extraction.';
        } else if (listItem === 'emissions') {
            speakOutput = 'Nuclear energy produces electricity with zero carbon emissions, making it a key player in combating climate change. Makes you wonder who has fed us all of this misinformation...';
        } else if (listItem === 'safety') {
            speakOutput = 'Modern nuclear power plants are built with multiple safety systems to prevent accidents. They are among the safest forms of energy generation when managed properly. In fact, nuclear energy results in 0.3 deaths per terawatt-hour. Compare that to oil, which racks up nearly 20 deaths per terawatt-hour.';
        } else {
            // Handle unexpected or unrecognized slot values
            speakOutput = 'I\'m sorry, I didn\'t understand that. Please ask about efficiency, emissions, or safety.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What else would you like to learn about nuclear energy?')
            .getResponse();
    }
};

const ClimateClockIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ClimateClock';
    },
    handle(handlerInput) {
        const speakOutput = `The Climate Clock shows the time left to limit global warming to 1.5 degrees Celsius. This highlights the urgent need to reduce carbon emissions. Nuclear energy plays a vital role in achieving this goal. Would you like to learn how?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to know more about nuclear energy’s role in combating climate change?')
            .getResponse();
    }
};

const MakeDifferenceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MakeDifference';
    },
    handle(handlerInput) {
        const actions = "You can make a difference by learning more about nuclear energy, sharing accurate information, and supporting policies that promote clean energy solutions. You can also join organizations that advocate for sustainable energy initiatives.";
        const speakOutput = `${actions} How else can I assist you today?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like to learn next?')
            .getResponse();
    }
};


const CheckStatsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckStats';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.usageCount = (sessionAttributes.usageCount || 0) + 1;

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const speakOutput = `You have used Atomic Energy ${sessionAttributes.usageCount} times. Keep it up!`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like to do next?')
            .getResponse();
    }
}; 

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
const skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        ExplainNuclearBenefitIntentHandler,
        ClimateClockIntentHandler,
        MakeDifferenceIntentHandler,
        CheckStatsIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .create();

    const adapter = new ExpressAdapter(skill, false, false);
    const app = express();

    app.post('/', adapter.getRequestHandlers());
    app.use(express.static(__dirname + '/public'));
    exports.app = app;