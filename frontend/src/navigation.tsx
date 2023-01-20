/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useRecoilState } from "recoil";
import {
  authAtom,
  coursesAtom,
  filteredCoursesAtom,
  myCoursesAtom,
  searchStringAtom,
  sortCoursesAtom,
} from "./application/Atoms";
import { CourseEnrollment } from "./domain/course-enrollment";
import { SortCoursesEnum } from "./domain/sort-courses";
import Notifications from "./sidebar";

const Navigation: React.FC = () => {
  const [searchString, setSearchString] = useRecoilState(searchStringAtom);
  const [sortCoursesType, setSortCoursesType] = useRecoilState(sortCoursesAtom);
  const [filteredCourses] = useRecoilState(filteredCoursesAtom);
  const [myCourses, setMyCourses] = useRecoilState(myCoursesAtom);
  const [courses] = useRecoilState(coursesAtom);
  const [token] = useRecoilState(authAtom);

  function toggleNotifications() {
    const notifications = document.getElementById("notification-sidebar");
    if (notifications?.classList.contains("shown")) {
      notifications?.classList.remove("shown");
    } else {
      notifications?.classList.add("shown");
    }
  }

  function displayMyCourses() {
    // change active
    const allCoursesElement = document.getElementById("all-courses-toggle");
    const myCoursesElement = document.getElementById("my-courses-toggle");
    if (allCoursesElement != null && myCoursesElement != null) {
      allCoursesElement.classList.remove("active");
      myCoursesElement.classList.add("active");
    }

    // create copy to modify State Elements and update them later
    fetch("http://localhost:8080/api/enrol/", {
      headers: {
        Authorization: "Bearer " + token[0],
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        const enrollments: CourseEnrollment[] = JSON.parse(
          JSON.stringify(json)
        );
        const nameList: string[] = [];
        enrollments.forEach((courseEnrollment) => {
          nameList.push(courseEnrollment.Course_Name);
        });

        let myCourses = courses.filter((course) =>
          nameList.includes(course.name)
        );
        setMyCourses(myCourses);
      });

    let myCourses = courses.filter((course) => !course.is_fwpm);
    setMyCourses(myCourses);
  }

  function displayAllCourses() {
    // change active
    const allCoursesElement = document.getElementById("all-courses-toggle");
    const myCoursesElement = document.getElementById("my-courses-toggle");
    if (allCoursesElement != null && myCoursesElement != null) {
      allCoursesElement.classList.add("active");
      myCoursesElement.classList.remove("active");
    }
    // create copy to modify State Elements and update them later
    setMyCourses([]);
  }

  /* ------  TODO  -----

Navigation:
 - Aktiver Link in "#toggle-menu" UND "#mobile-menu-top" bekommt Klasse "active"
 - Die buttons "nav-news" UND "mobile-nav-news" bekommen die Klasse "indicate" bei eigehender Ankündigung

 */

  return (
    <div>
      <nav id="main-menu">
        <aside className="menu-element">
          <Dropdown>
            <Dropdown.Toggle id="nav-filter">Kurse sortieren</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item // no need for href="#/action-1" here
                onClick={() => {
                  setSortCoursesType(SortCoursesEnum.Alphabetical);
                }}
              >
                Alphabetisch
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortCoursesType(SortCoursesEnum.Semester);
                }}
              >
                Semester
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </aside>
        <aside className="menu-element">
          <div className="toggle-menu">
            <a
              id="all-courses-toggle"
              className="active"
              onClick={displayAllCourses}
            >
              <i className="fa-solid fa-list-ul"></i>
              Alle Kurse
            </a>
            <a id="my-courses-toggle" className="" onClick={displayMyCourses}>
              <i className="fa-solid fa-house"></i>
              Meine Kurse
            </a>
          </div>
        </aside>
        <aside className="menu-element">
          <button
            id="nav-news"
            className="indicate"
            onClick={() => toggleNotifications()}
          >
            <i className="fa-solid fa-message"></i>
          </button>
        </aside>
        <aside className="menu-element">
          <form className="nav-search">
            <input
              type="search"
              placeholder="Kurs suchen.."
              aria-label="Search"
              onChange={(input) => {
                setSearchString(input.target.value);
              }}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </aside>
      </nav>
      <div id="mobile-menu-top">
        <a href="" className="active">
          Alle Kurse
        </a>
        <a href="">Meine Kurse</a>
      </div>
      <div id="mobile-menu-bottom">
        <div className="mobile-menu-bottom-item">
          <Dropdown>
            <Dropdown.Toggle id="bot-nav-filter">
              <i className="fa-solid fa-sliders"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Alphabetisch</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Semester</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Status</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="mobile-menu-bottom-item">
          <button
            id="mobile-nav-news"
            className="indicate"
            onClick={() => toggleNotifications()}
          >
            <i className="fa-solid fa-message"></i>
          </button>
        </div>
        <div className="mobile-menu-bottom-item">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="checkbox" />
          <form className="mobile-search-area">
            <input
              type="search"
              placeholder="Kurs suchen.."
              aria-label="Search"
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Suchen</span>
            </button>
          </form>
        </div>
      </div>
      <Notifications />
    </div>
  );
};

export default Navigation;
