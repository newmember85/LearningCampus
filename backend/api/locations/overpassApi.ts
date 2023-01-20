import { readFileSync, writeFileSync } from 'fs';
const fetch = require('node-fetch');
const url = 'https://overpass-api.de/api/interpreter/';


const filename = './overpass_api_data.json';

// Query =>Overpass Query to select all Ways with Name = Gebäude in given bounding box

async function getDataFromApi() {
    const query = '[out:json];(way["name"~"Gebäude"](47.86564, 12.10603, 47.86853, 12.11094););(._;>;);out center;';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/xml',
        },
        body: query
    });
    const data = await response.text();
    writeFileSync(filename, data);
}


async function prepareOverpassData(): Promise<any> {
    const fileContent = readFileSync(filename, 'utf-8');
    const item = JSON.parse(fileContent);

    const data_array: { id: any; building: any; geometry: { type: string; coordinates: any[]; }; }[] = []
    const data = item.elements.filter((item: { type: string; }) => item.type === "way");
    data.forEach((_element: any) => {
        const point = { type: 'Point', coordinates: [_element.center.lat, _element.center.lon] };
        data_array.push({
            id: _element.id,
            building: _element.tags.name,
            geometry: point
        });
    });
    return data_array;

};

export async function returnOverPassData() {
    await getDataFromApi();
    const data = await prepareOverpassData()
    return data;
}