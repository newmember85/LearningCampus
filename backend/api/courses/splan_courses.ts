const fetch = require('node-fetch');
import * as htmlparser2 from "htmlparser2";
import render from "dom-serializer";
import * as CSSselect from "css-select";
import { Document } from 'domhandler';


async function getDataFromURL(url: string) {
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.text();
    const dom = htmlparser2.parseDocument(data);
    return dom;
}
function weekDayFilter(dom: any) {
    type day = { [key: string]: Array<Number> }
    const ttxline: Array<any> = dom.children[2].children
    console.log(typeof (ttxline));
    const weekDays: day = {}
    ttxline.forEach((values: any) => {
        const min = parseInt(values.attribs.style.split('left:')[1].split('px')[0])
        const max = parseInt(values.attribs.style.split('width:')[1].split('px')[0]) + min
        const weekDay: string = values.children[0].attribs["data-i18n"]
        weekDays[weekDay] = [min, max]
    })
    return weekDays;

}
function getSpecificDom(dom: Document) {
    var html = ""
    for (let h1 of CSSselect.selectAll('div .ttevent', dom)) {
        html = html + render(h1)
    }
    const dom2 = htmlparser2.parseDocument(html);
    return dom2;
}
function findDay(value_position: number, week_object: { [x: string]: [any, any]; }) {
    const day = Object.keys(week_object).find(key => {
        const [start, end] = week_object[key];
        return value_position >= start && value_position <= end;
    });
    return day || "No day found for the given value.";
}

function filterCourses(dom: any, weekDay: any) {
    const arrayCourse = new Set();
    for (const values of dom.children) {
        const position = parseInt(values.attribs.style.split('left:')[1].split('px')[0]) + 1;
        const day = findDay(position, weekDay)
        for (const items of values.children) {
            if (items.children && items.children.length) {
                const courseData = []
                for (var i = 0; i < items.children.length; i += 2) {
                    if (items.children[i].data) {
                        courseData.push(items.children[i].data)
                    } else {
                        courseData.push(items.children[i].attribs["data-date"])
                    }
                }
                courseData.push(values.children[3].data)
                courseData.push(day)
                arrayCourse.add(courseData)
            }
        }
    }
    return arrayCourse
}
const speciaValues = ["Prüfung", "online", "Online", "präsentation", "Abschlusspräsentation", "Wdh.-Prüfung", "Praktikum", "Seminar"]
const specialCourses = []
const specialDate: unknown[] = []

export async function getDatafromSPLAN(url: string) {
    const item = await getDataFromURL(url);
    const weekday = weekDayFilter(item)
    const dom = getSpecificDom(item)

    const allCoursesFromTTT = Array.from(new Set([...filterCourses(dom, weekday)].filter(x => (x as string).length > 3)));


    const currentCourses: any = []

    allCoursesFromTTT.forEach((x) => {
        currentCourses.push((x as string)[0])
        const found = speciaValues.some(r => (x as Array<any>).includes(r))
        const specialChar = speciaValues.some(r => (x as Array<any>)[0].includes(r))
        const index = allCoursesFromTTT.indexOf(x)
        if (found || specialChar) {
            delete allCoursesFromTTT[index];
            specialCourses.push(x)
        } else if ((x as Array<any>).length > 7) {
            delete allCoursesFromTTT[index];
            specialDate.push(x)
        }
    })
    const normalCoursesOnGiveTime = allCoursesFromTTT.map(innerArray => (innerArray as string[])[0]).filter(x => x);
    let difference = [...new Set(currentCourses)].filter(x => !normalCoursesOnGiveTime.includes((x as string)));

    let intersection = specialDate.filter(x => difference.includes((x as Array<String>)[0]))
    intersection.filter(arr => (arr as Array<any>).filter(value => {
        if ((isNaN(Date.parse(value as string)) && (value as string).length > 2)) {
            return true
        }
        else {
            const deleteValue = (arr as any).indexOf(value)
            delete (arr as any)[deleteValue]
        }

    }))
    const normalTimesWithRoom = allCoursesFromTTT.filter(x => x)

    const uniqueArrays = [...new Set(intersection.map((x: unknown) => JSON.stringify(x)))].map(v => {
        const array = JSON.parse(v)
        return array.filter((x: string) => x)
    })
    const uniqueArrayForTimesNormal = [...new Set(normalTimesWithRoom.map((x: unknown) => JSON.stringify(x)))].map((x: string) => JSON.parse(x));

    const allTimes = [...uniqueArrayForTimesNormal, ...uniqueArrays]
    const courses = allTimes.map(input => [input[0], input[input.length - 2], input[2]])
    const lecturer = allTimes.map(input => [input[0], input[1], input[4], input[2]])

    const courses_Set = [...new Set(courses.map((x: unknown) => JSON.stringify(x)))].map((x: string) => JSON.parse(x));
    const lecturer_Set = [...new Set(lecturer.map((x: unknown) => JSON.stringify(x)))].map((x: string) => JSON.parse(x));
    const lecture_Set = [...new Set(allTimes.map((x: unknown) => JSON.stringify(x)))].map((x: string) => JSON.parse(x));
    return [courses_Set, lecturer_Set, lecture_Set]
}
