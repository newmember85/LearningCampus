import { readFileSync, writeFileSync } from 'fs';
const fetch = require('node-fetch');
const url = 'https://splan.fh-rosenheim.de/splan/json?m=getros&loc=3';


const filename = './splan_locations.json';

async function getDataFromURL() {
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.text();
    writeFileSync(filename, data);
}

async function prepareThData(): Promise<any> {

    const fileContent = readFileSync(filename, 'utf-8');
    const item = JSON.parse(fileContent);

    const result = item[0].map((location: any) => {
        return {
            building: "Gebäude " + location.shortname[0],
            level: "Etage " + location.shortname[1],
            room: "Raum " + location.shortname.split('.')[1],
            shortname: location.shortname
        };
    });
    const filter_result = result.filter((item: any) => {
        return item.level !== "Etage -" && item.room !== 'Raum undefined';
    });

    return filter_result;

};


export async function returnSplanLocations() {
    await getDataFromURL();
    const data = await prepareThData()
    return data;
}

