import fetch from 'node-fetch';
import { getCouresFromGivenDegree } from '../backend/api/courses/index'
import { saveLocationData } from '../backend/api/locations/index'


const fakulties = [
    {
        name: "Informatik"
    },
    {
        name: "Holztechnik und Bau"
    },
    {
        name: "Angewandte Gesundheits- und Sozialwissenschaften"
    },
    {
        name: "Angewandte Natur- und Geisteswissenschaften"
    },
    {
        name: "Betriebswirtschaft"
    },
    {
        name: "Chemische Technologie und Wirtschaft"
    },
    {
        name: "Ingenieurwissenschaften"
    },
    {
        name: "Innenarchitektur, Architektur und Design"
    },
    {
        name: "Sozialwissenschaften"
    },
    {
        name: "Wirtschaftsingenieurwesen"
    }
]
const degree_Programmes = [
    {
        name: 'Management in der Gesundheitswirtschaft',
        abbreviation: 'MGW-B',
        semester_count: 7,
        faculty: 'Angewandte Gesundheits- und Sozialwissenschaften',
        splan_id: 31
    },
    {
        name: 'Pflegewissenschaft',
        abbreviation: 'PW-B',
        semester_count: 7,
        faculty: 'Angewandte Gesundheits- und Sozialwissenschaften',
        splan_id: 103
    },
    {
        name: 'Physiotherapie',
        abbreviation: 'PHY-B',
        semester_count: 7,
        faculty: 'Angewandte Gesundheits- und Sozialwissenschaften',
        splan_id: 32
    },
    {
        name: 'Energie- und Gebäudetechnologie',
        abbreviation: 'EGT-B',
        semester_count: 7,
        faculty: 'Angewandte Natur- und Geisteswissenschaften',
        splan_id: 21
    },
    {
        name: 'Wirtschaftsmathematik-Aktuarwissenschaften',
        abbreviation: 'WMA-B',
        semester_count: 7,
        faculty: 'Angewandte Natur- und Geisteswissenschaften',
        splan_id: 22
    },
    {
        name: 'Betriebswirtschaft',
        abbreviation: 'BW-B',
        semester_count: 7,
        faculty: 'Betriebswirtschaft',
        splan_id: 24
    },
    {
        name: 'Chemieingenieurwesen',
        abbreviation: 'CHE-B',
        semester_count: 7,
        faculty: 'Chemische Technologie und Wirtschaft',
        splan_id: 88
    },
    {
        name: 'Prozessautomatisierungstechnik',
        abbreviation: 'PAT-B',
        semester_count: 7,
        faculty: 'Chemische Technologie und Wirtschaft',
        splan_id: 111
    },
    {
        name: 'Umwelttechnologie',
        abbreviation: 'UWT-B',
        semester_count: 7,
        faculty: 'Chemische Technologie und Wirtschaft',
        splan_id: 102
    },
    {
        name: 'Bauingenieurwesen',
        abbreviation: 'BI-B',
        semester_count: 7,
        faculty: 'Holztechnik und Bau',
        splan_id: 97
    },
    {
        name: 'Holzbau und Ausbau',
        abbreviation: 'HA-B',
        semester_count: 7,
        faculty: 'Holztechnik und Bau',
        splan_id: 26
    },
    {
        name: 'Holztechnik',
        abbreviation: 'HT-B',
        semester_count: 7,
        faculty: 'Holztechnik und Bau',
        splan_id: 27
    },
    {
        name: 'Innenausbau',
        abbreviation: 'IAB-B',
        semester_count: 7,
        faculty: 'Holztechnik und Bau',
        splan_id: 28
    },
    {
        name: 'Applied Artificial Intelligence',
        abbreviation: 'AAI-B',
        semester_count: 7,
        faculty: 'Informatik',
        splan_id: 105
    },
    {
        name: 'Informatik',
        abbreviation: 'INF-B',
        semester_count: 7,
        faculty: 'Informatik',
        splan_id: 33
    },
    {
        name: 'Wirtschaftsinformatik',
        abbreviation: 'WIF-B',
        semester_count: 7,
        faculty: 'Informatik',
        splan_id: 34
    },
    {
        name: 'Elektro- und Informationstechnik',
        abbreviation: 'EIT-B',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 36
    },
    {
        name: 'Kunststofftechnik',
        abbreviation: 'KT-B',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 37
    },
    {
        name: 'Maschinenbau',
        abbreviation: 'MB-B(b)',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 38
    },
    {
        name: 'Mechatronik',
        abbreviation: 'MEC-B',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 39
    },
    {
        name: 'Medizintechnik',
        abbreviation: 'MT-B',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 104
    },
    {
        name: 'Nachhaltige Polymertechnik',
        abbreviation: 'NPT-B',
        semester_count: 7,
        faculty: 'Ingenieurwissenschaften',
        splan_id: 110
    },
    {
        name: 'Architektur',
        abbreviation: 'ARC-B',
        semester_count: 8,
        faculty: 'Innenarchitektur, Architektur und Design',
        splan_id: 95
    },
    {
        name: 'Innenarchitektur',
        abbreviation: 'INN-B',
        semester_count: 7,
        faculty: 'Innenarchitektur, Architektur und Design',
        splan_id: 44
    },
    {
        name: 'Angewandte Psychologie',
        abbreviation: 'APS-B',
        semester_count: 7,
        faculty: 'Sozialwissenschaften',
        splan_id: 98
    },
    {
        name: 'Pädagogik der Kindheit',
        abbreviation: 'PDK-B',
        semester_count: 7,
        faculty: 'Sozialwissenschaften',
        splan_id: 83
    },
    {
        name: 'Soziale Arbeit',
        abbreviation: 'SOA-B',
        semester_count: 7,
        faculty: 'Sozialwissenschaften',
        splan_id: 94
    },
    {
        name: 'Wirtschaftsingenieurwesen',
        abbreviation: 'WI-B',
        semester_count: 7,
        faculty: 'Wirtschaftsingenieurwesen',
        splan_id: 46
    }
]

const students = [
    {
        matrikel_nr: 930001,
        surname: "Mustermann",
        name: "Max",
        username: "MuMa",
        password: "1234",
        degree_name: "Informatik"
    },
    {
        matrikel_nr: 930002,
        surname: "Hochberger",
        name: "Ingo",
        username: "HoIn",
        password: "5678",
        degree_name: "Wirtschaftsinformatik"
    },
    {
        matrikel_nr: 930003,
        surname: "Maier",
        name: "Frin",
        username: "MaFr",
        password: "556525",
        degree_name: "Betriebswirtschaft",
    },
    {
        matrikel_nr: 930004,
        surname: "Franzis",
        name: "Otto",
        username: "FrOt",
        password: "556525",
        degree_name: "Holztechnik"
    },
]

const course_enrollment = [
    {
        matrikel_nr: "930001",
        course: "Grundlagen der Informatik"
    },
    {
        matrikel_nr: "930001",
        course: "Stochastik"
    },
    {
        matrikel_nr: "930001",
        course: "Künstliche Intelligenz"
    },
    {
        matrikel_nr: "930002",
        course: "Rechnernetze"
    },
    {
        matrikel_nr: "930002",
        course: "Datenbanken"
    },
    {
        matrikel_nr: "930002",
        course: "Internes Rechnungswesen"
    },
    {
        matrikel_nr: "930003",
        course: "Wirtschaftsmathematik"
    },
    {
        matrikel_nr: "930004",
        course: "Technische Mechanik"
    }
]
const course_content = [
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Grundlagen der Informatik",
        degree: "Informatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Stochastik",
        degree: "Informatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Künstliche Intelligenz",
        degree: "Informatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Rechnernetze",
        degree: "Informatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Datenbanken",
        degree: "Wirtschaftsinformatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Internes Rechnungswesen",
        degree: "Wirtschaftsinformatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Wirtschaftsmathematik",
        degree: "Wirtschaftsinformatik"
    },
    {
        title: "Titel 1",
        text: "Ich bin ein Text.",
        content_type: "Text",
        url_path: "null",
        course: "Technische Mechanik",
        degree: "Holztechnik"
    }
]

const model_url = "http://localhost:8080";
async function request(object: any, apiRoute: string) {
    const url = model_url + apiRoute;
    for (const element of object) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(element)
        }); const { data, errors } = await response.json()
        console.log(data);
        console.log(errors);
    }
};

async function makeRequests(degree_programmes: string | any[]) {
    let promises = [];
    for (let i = 0; i < 24; i++) {
        promises.push(getCouresFromGivenDegree(degree_programmes[i].name, degree_programmes[i].splan_id).then(async x => {
            await request(x[0], "/api/course")
            await request(x[1], "/api/lecturer")
            await request(x[2], "/api/lecture")
        }));
    }
    return Promise.all(promises);
}
saveLocationData()
    .then(() => request(fakulties, "/api/faculty"))
    .then(() => request(degree_Programmes, "/api/degreeProgrammes"))
    .then(() => request(students, "/api/student"))
    .then(() => {
        makeRequests(degree_Programmes)
            .then(() => request(course_enrollment, "/api/enrol"))
            .then(() => request(course_content, "/api/courseContent"))
    })