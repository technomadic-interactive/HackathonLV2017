/**
 * Created by Jonan on 1/7/2017.
 */
var Alexa = require('alexa-sdk');
//var ical = require('ical');
var http = require('http');
var utils = require('util');
var fs = require('fs');
var request = require('request');

var states = {
    EMERGENCYCALLMODE: '_EMERGENCYCALLMODE',
    HAVINGEMERGENCYMODE: '_HAVINGEMERGENCYMODE',
    DESICIONMODE1: '_DESICIONMODE1',
    DESICIONMODE2: '_DESICIONMODE2'

};
// local variable holding reference to the Alexa SDK object
var alexa;

//OPTIONAL: replace with "amzn1.ask.skill.[your-unique-value-here]";
var APP_ID = 'amzn1.ask.skill.d9e02c9c-f0ef-43fe-8b5f-8629ca90dc4d';

// Skills name
var skillName = "Emergency Call:";

// Message when the skill is first called
var welcomeMessage = "Welcome to the personal health care asistans. What can i do for you today";

// Message for help intent
var HelpMessage = "Here are some things you can say: please call to emergency? i don't fill good today call to emergency?";

// Used to tell user skill is closing
var shutdownMessage = "Thank you for trying the personal health care asistans. Have a nice day!.";

// Used when an event is asked for
var killSkillMessage = "Thank you for trying the personal health care asistans. Have a nice day!";



// output for Alexa
var output = "";

// stores events that are found to be in our date range
var relevantEvents = new Array();

// Adding session handlers
var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.HAVINGEMERGENCYMODE;
        this.emit(':ask',welcomeMessage, welcomeMessage);
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    },
};


// Create a new handler object for EMERGENCYCALLMODE state
var emergencyCallHandlers = Alexa.CreateStateHandler(states.HAVINGEMERGENCYMODE, {
    'GetEmergencyCall': function () {
        output = "The call to emergency it was canceled. Are you ok? ";
        var repromt = " Can you tell me if you are fine by saying yes or no?";

        // set state to asking questions
        this.handler.state = states.DESICIONMODE1;


        this.emit(':ask', output, repromt);

    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});


// Create a new handler object for DESICIONMODE1 state
var desicion1Handlers = Alexa.CreateStateHandler(states.DESICIONMODE1, {

   'AMAZON.HelpIntent': function () {
        this.emit(':ask', descriptionStateHelpMessage, descriptionStateHelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.NoIntent': function () {

        // GET to call 911---------------------------------------------------------------------


        console.log("Before");
        request.post('http://199.195.116.177/alexaHack/alexa_post.php', {form:{llamar: true}});
        console.log("After");
        request('http://199.195.116.177/alexaHack/alexa_post.php',{form:{llamar: false}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var yesResponse = "I will call to emergency, please don't move the help is on way.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }else{
                var yesResponse = "Sorry i can make the call.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }

        })
    },

    'AMAZON.YesIntent': function () {

        // cancel to call 911---------------------------------------------------------------------
        console.log("Before");
        request.post('http://199.195.116.177/alexaHack/alexa_post.php', {form:{llamar: false}});
        console.log("After");
        request('http://199.195.116.177/alexaHack/alexa_post.php',{form:{llamar: false}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var yesResponse = "Thank you for traying the personal health care asistans. Have a nice day!.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }else{
                var yesResponse = "Sorry i can make the call.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }

        })


    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});


// Create a new handler object for HAVINGEMERGENCYMODE state
var havingEmergencyHandlers = Alexa.CreateStateHandler(states.HAVINGEMERGENCYMODE, {
    'HavingEmergency': function () {
        output = "Do you want me to call emergency ? ";
        var repromt = " Do you want me to call emergency or can you tell me if you are fine by saying yes or no?";

        // set state to asking questions
        this.handler.state = states.DESICIONMODE2;


        this.emit(':ask', output, repromt);

    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

   'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});



// Create a new handler object for DESICIONMODE2 state
var desicion2Handlers;
desicion2Handlers = Alexa.CreateStateHandler(states.DESICIONMODE2, {
    'AMAZON.HelpIntent': function () {
         this.emit(':ask', descriptionStateHelpMessage, descriptionStateHelpMessage);
         },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.NoIntent': function () {

        // cancel to call 911---------------------------------------------------------------------

        console.log("Before");
        request.post('http://199.195.116.177/alexaHack/alexa_post.php', {form:{llamar: false}});
        console.log("After");
        request('http://199.195.116.177/alexaHack/alexa_post.php',{form:{llamar: false}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var yesResponse = "Thank you for traying the personal health care asistans. Have a nice day!.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }else{
                var yesResponse = "Sorry i can make the call.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }

        })

    },

    'AMAZON.YesIntent': function () {
            // GET to call 911---------------------------------------------------------------------

        console.log("Before");
        request.post('http://199.195.116.177/alexaHack/alexa_post.php', {form:{llamar: true}});
        console.log("After");
        request('http://199.195.116.177/alexaHack/alexa_post.php',{form:{llamar: false}}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var yesResponse = "I will call to emergency, please don't move the help is on way.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }else{
                var yesResponse = "Sorry i can make the call.";
                this.emit(':tell', yesResponse);// Show the HTML for the Google homepage.
            }

        })

            
        },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});

// register handlers
exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.d9e02c9c-f0ef-43fe-8b5f-8629ca90dc4d';
    alexa.registerHandlers(newSessionHandlers, havingEmergencyHandlers, emergencyCallHandlers,desicion1Handlers,desicion2Handlers);
    alexa.execute();
};


