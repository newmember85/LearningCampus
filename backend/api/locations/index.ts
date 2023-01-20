import { returnOverPassData } from "./overpassApi";
import { returnSplanLocations } from "./thplan";
import Location from "../../database/models/location";

export async function saveLocationData() {
    const overpass = await returnOverPassData();
    const thPlan = await returnSplanLocations();

    const result = thPlan.map((element: any) => {
        const result = overpass.find((item: { building: any; }) => item.building === element.building);
        return {
            way_id: result.id,
            building: result.building,
            level: element.level,
            room: element.room,
            shortname: element.shortname,
            geometry: result.geometry
        };
    });
    await Location.bulkCreate(result).then(() => console.log("Users data have been saved"));
}
// e
