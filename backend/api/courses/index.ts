import { getDatafromSPLAN } from "./splan_courses";
import { default_pwd } from '../../constants'
const fetch = require('node-fetch');
import Location from "../../database/models/location";



const currentpu = 24
async function getSemester(degreeProgramme: Number) {
    const url = `https://splan.fh-rosenheim.de/splan/json?m=getPgsExt&pu=${currentpu}&og=${degreeProgramme}`
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.json();
    const semester: any[] = [];
    data[0].forEach((element: { shortname: any; }) => {
        semester.push(element.shortname);
    });
    return semester;
}
function getAllRooms(rooms: Location[] | { dataValues: { shortname: any; }; }[]) {
    const roomsArray: any[] = []
    rooms.forEach((element) => {
        roomsArray.push(element.dataValues.shortname)
    });
    return roomsArray;
}
export async function getCouresFromGivenDegree(degree_name: string, splan_id: Number) {
    let courseData = []
    let lecturerData = []
    let courseDetails = []
    const current_semester = await getSemester(splan_id);
    for (let i = 0; i < current_semester.length; i++) {
        const url = `https://splan.fh-rosenheim.de/splan/json?m=getTT&sel=pg&pu=${currentpu}&og=${splan_id}&pg=${current_semester[i]}&sd=false&dfc=2022-12-30&loc=3&sa=true&cb=o`;
        const data = await getDatafromSPLAN(url);
        courseData.push(data[0])
        lecturerData.push(data[1])
        courseDetails.push(data[2])
    }
    const db = await Location.findAll({
        attributes: ["shortname"]
    })
    const rooms = getAllRooms(db);
    const course = courseData.filter((nestedArray) => {
        return nestedArray.length > 0;
    });
    const lecturer = lecturerData.filter((nestedArray) => {
        return nestedArray.length > 0;
    });
    const details = courseDetails.filter((nestedArray) => {
        return nestedArray.length > 0;
    });
    const course_db = creatingCourseObject(degree_name, course)
    const lecturer_db = creatingLecturerObject(lecturer)
    const details_db = createDetailObject(details, rooms)
    const lecture_db = createLectureObject(course_db, lecturer_db, details_db)
    return [course_db, lecturer_db, lecture_db];

}
function containsNumbers(str: string) {
    return /\d/.test(str);
}

function createLectureObject(course_value: any[], lecturer_value: any[], comp_value: any[]) {
    const courses = course_value;
    const lecturer = lecturer_value;
    const comp = comp_value;

    let lecture_object = {}
    const lecture: {}[] = []
    comp.forEach(nameObj => {
        const lecturerObj = lecturer.find(obj => obj.course_name === nameObj.name && obj.username === nameObj.lecturer);
        const courseObj = courses.find(obj => obj.name === nameObj.name)

        let course_name = "null"
        let lecturer_username = "null"
        if (lecturerObj && courseObj) {
            course_name = courseObj.name
            lecturer_username = lecturerObj.username
        }
        lecture_object = {
            time_range: nameObj.time_range,
            day: nameObj.day,
            degree: courseObj.degreeProgramme,
            course: course_name,
            lecturer: lecturer_username,
            location: nameObj.location
        }
        lecture.push(lecture_object)
    })
    return lecture;
}



function createDetailObject(comp_value: any[], rooms: string | any[]) {
    const charValues = ["egt", "tbd", "standardtermin", "information", "prüfung", "online", "vorlesung", "veranstaltung", "exkursion", "raum", "herr", "frau", "prüfungsabnahme", "räume", "gruppen", "gruppenarbeit", "gruppenarbeiten", "keine", "in", "im", "termin", "alle", "berufsschule", "präsentationen", "und", "zum", "praxissemester", "teilgruppe", "nach", "präsentation", "rosenheim)", "projektmanagement"]
    const timeRegex = /\d{2}:\d{2}-\d{2}:\d{2}/;
    const weekDayRegex = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
    let detail_object = {}
    const details: {}[] = []
    comp_value.forEach(data => {
        data.forEach((element: any[]) => {
            let index = 0
            const nameArray = element[1].split(", ");
            for (const user of nameArray) {
                const person = user.split(/(\s+)/).filter((s: string | any[]) => s.length > 1);
                if (person.length > 2) {
                    index = 1
                }
                if (!person.some((r: string) => charValues.includes(r.toLowerCase()))) {
                    const username = person[person.length - 1].substring(0, 4) + person[index].substring(0, 2)
                    const hasTime = element.find(item => timeRegex.test(item));
                    const hasWeekDay = element.find(item => weekDayRegex.test(item));
                    const hasRoom = element.find(item => rooms.includes(item))
                    if (hasTime && hasWeekDay && hasRoom) {
                        detail_object = {
                            name: element[0],
                            location: hasRoom,
                            time_range: hasTime,
                            day: hasWeekDay,
                            lecturer: username
                        }
                        details.push(detail_object)
                    }
                }
            }
        });
    });
    return details;
}

function creatingCourseObject(degree_name: string, comp_value: any[]) {
    let course_object = {}
    const courses: {}[] = []
    const timeRegex = /\d{2}:\d{2}-\d{2}:\d{2}/;
    comp_value.forEach(data => {
        data.forEach((element: any[]) => {
            let is_fwpm = true;
            const semesters = element[2].split(",").map((x: string) => x.trim())

            const contains_fwpm = semesters.filter((v: string | string[]) => !v.includes('/FWPM')).filter((v: string[]) => v[0] === degree_name[0]);

            let semester_count = 0
            if (contains_fwpm.length > 0) {
                is_fwpm = false
                semester_count = contains_fwpm[0].slice(-1)
            }
            let abb = "null"
            const substrings = element[1].split(";");
            const time = substrings.find((substring: string) => timeRegex.test(substring));
            if (!time) {
                abb = element[1]
            }
            course_object =
            {
                name: element[0],
                abbreviation: abb,
                semester: semester_count,
                is_fwpm: is_fwpm,
                degreeProgramme: degree_name
            }
            courses.push(course_object)


        });
    });
    return courses;
};

function creatingLecturerObject(comp_value: any[]) {
    const charValues = ["egt", "tbd", "standardtermin", "information", "prüfung", "online", "vorlesung", "veranstaltung", "exkursion", "raum", "herr", "frau", "prüfungsabnahme", "räume", "gruppen", "gruppenarbeit", "gruppenarbeiten", "keine", "in", "im", "termin", "alle", "berufsschule", "präsentationen", "und", "zum", "praxissemester", "teilgruppe", "nach", "präsentation", "rosenheim)", "projektmanagement"]
    let lecture_object = {}
    const lecturer: {}[] = []

    comp_value.forEach(data => {
        data.forEach((element: any[]) => {
            let index = 0
            let title = "null"
            const nameArray = element[1].split(", ");
            for (const user of nameArray) {
                const person = user.split(/(\s+)/).filter((s: string | any[]) => s.length > 1);
                if (person.length > 2) {
                    index = 1
                    title = person[0]
                }
                if (person.length > 1 && person[index].length > 2 && person.length < 5 && !containsNumbers(title) && !containsNumbers(person[person.length - 1]) && !containsNumbers(person[index]) && !charValues.includes(title) && !person.some((r: string) => charValues.includes(r.toLowerCase()))) {
                    const username = person[person.length - 1].substring(0, 4) + person[index].substring(0, 2)
                    lecture_object =
                    {
                        title: title,
                        name: person[person.length - 1],
                        surname: person[index],
                        username: username,
                        password: default_pwd,
                        course_name: element[0]

                    }
                    lecturer.push(lecture_object)

                }
            }
        });
    });
    const unique = lecturer.filter((obj, index, self) => {
        return self.findIndex(otherObj => JSON.stringify(otherObj) === JSON.stringify(obj)) === index;
    });
    return unique;
};

