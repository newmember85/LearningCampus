import { Course } from "../domain/course";
import refreshAuthToken from "./refresh-token";

const getCourses = async (
  token: string,
  refreshToken: string
): Promise<Course[]> => {
  let courses: Course[];

  try {
    const response = await fetch("http://localhost:8080/api/course", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 401) {
      token = await refreshAuthToken(refreshToken);

      getCourses(token, refreshToken);

      return [];
    }

    const data = await response.text();

    courses = JSON.parse(data);

    return courses;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export default getCourses;
