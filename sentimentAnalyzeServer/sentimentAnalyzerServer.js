const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

// const api_key = process.env.API_KEY;
// const api_url = process.env.API_URL;

function getNLUInstance() {
    /*Type the code to create the NLU instance and return it.
    You can refer to the image in the instructions document
    to do the same.*/
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY
        }),
        serviceUrl: process.env.API_URL
    });
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/", (req, res) => {
    res.render('index.html');
});

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req, res) => {
    // //Extract the url passed from the client through the request object
    let urlToAnalyze = req.query.url
    const analyzeParams =
    {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //Print the JSON returned by NLU instance as a formatted string
            // console.log(JSON.stringify(analysisResults.result.keywords[0].emotion, null, 2));
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", async (req, res) => {
    //extracting URL from request
    let requestURL = req.query.url

    //create payload
    const payload = {
        "url": requestURL,
        "features": {
            "Keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    }

    const instanceNLU = getNLUInstance()
    try {
        const response = await instanceNLU.analyze(payload)
        if (Object.keys(response).length > 0) {
            return res.send("url sentiment for " + response.result.keywords[0].sentiment, null, 2);
        }
    } catch (error) {
        return res.rend("There was an error." + error)
    }
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", async (req, res) => {
    //get query from requests
    let queryText = req.query.text

    //create payload structure
    const payload = {
        "text": queryText,
        "features": {
            keywords: {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const NLUInstance = getNLUInstance()

    try {
        const response = await NLUInstance.analyze(payload)
        if (Object.keys(response).length > 0) {
            return res.send(response.result.keywords[0].emotion, null, 2)
        }
    } catch (error) {
        return res.send("There was an error to process the request." + error)
    }
    // return res.send({ "happy": "10", "sad": "90" });
});

app.get("/text/sentiment", async (req, res) => {
    let queryText = req.query.text
    console.log('queryText', queryText)
    const payload = {
        "text": queryText,
        "features": {
            "keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    }

    const NLUInstance = getNLUInstance()

    try {
        const response = await NLUInstance.analyze(payload)
        console.log('response', response)
        if (Object.keys(response).length > 0) {
            return res.send(response.result.keywords[0].sentiment, null, 2)
        }
    } catch (error) {
        res.send("There was an error while processing the request" + error)
    }
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

