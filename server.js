import express from 'express';
import { google } from 'googleapis';
import { countries, europeanCountries } from './modules/countries.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/countries', (req,res) => {
    const obj = {
        countries,
        europeanCountries
    }
    res.json(obj)
})

app.post('/', async (req,res) => {
    const data = req.body;

    console.log(data);

    let dataArray = [];

    for(let i in data) {
        dataArray.push(data [i])
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "1GxOyRpAPA1MTSnLibQobUlmsf70JyldUmF_ZTpBLonQ";

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Arkusz1!A:B",
        valueInputOption: "RAW",
        resource: {
            values: [
                dataArray
            ]
        }
    })

    res.send();
})

app.listen(3000);