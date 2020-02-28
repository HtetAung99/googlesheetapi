const {google} = require("googleapis");
const credentials = require("./credentials.json");
const express = require("express");
const bodyParser = require('body-parser')
const pug = require("pug");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// client.authorize((err, tokens) => {
//     if (err){
//         res.status('500').send("Error")
//         return;
//     }
// });

let data, final;
let hasData = false;

const googlesheetAPI = google.sheets({ version: 'v4', auth: client });

let conf = {
    spreadsheetId: '1arV1jUv2pa09m4P2PFDggL7QQWZCCbghqxqDvyJwHew',
    range: 'Register!A1:G999'
};

googlesheetAPI.spreadsheets.values.get(conf).then(result => {
    data = result.data.values;
});

app.get('/', (req, res) => {
    res.render('index', {
        result: final,
        hasData: hasData
    });
})

app.post('/result', (req, res) => {
    let code = parseInt(req.body.code);
    final = null;
    hasData = true;    
    data.forEach((d) => {
        if (d[0] == code) {
            final = {
                type: d[2],
                date: d[6]
            }; 
        } 
    })  
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("API is listening on port 3000...");
})