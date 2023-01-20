import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "./application/Atoms";
import { CourseContent } from "./domain/course-content";
import { CourseDetails } from "./domain/course-details";
import getCourseContents from "./infrastructure/course-content-request";
import getCourseDetails from "./infrastructure/course-detail-request";
import Notifications from "./sidebar";

const Course: React.FC = () => {
  let { id } = useParams();
  const [course, setCourse] = useState<CourseDetails>();
  const [courseContent, setCourseContent] = useState<CourseContent>();
  const [token] = useRecoilState(authAtom);

  useEffect(() => {
    if (token[0].trim() === "" || token[1].trim() === "") {
      return;
    }

    getCourseDetails(token[0], token[1], id as string).then((course) => {
      setCourse(course);

      console.log(course);
    });

    getCourseContents(token[0], token[1], id as string).then((course) => {
      if (course === undefined) return;

      setCourseContent(course);

      console.log(course);
    });
  }, [id, token]);

  /* ------  TODO  -----

Home:
 - evtl. unter home speichern, ob man als letztes bei "Alle Kurse" oder "Meine Kurse" war,
    damit der "zurück-button" einen auch wieder da hin bringt und man dort weiter machen kann

 */

  function openNotifications() {
    const notifications = document.getElementById("notification-sidebar");
    notifications?.classList.add("shown");
  }

  return (
    <div className="content">
      <nav id="course-nav">
        <a href="../home">
          <i className="fa-solid fa-chevron-left"></i>
          Home
        </a>
        <button
          id="nav-news"
          className="indicate"
          onClick={() => openNotifications()}
        >
          <i className="fa-solid fa-message"></i>
        </button>
        <Notifications />
      </nav>
      <div className="bg-dimmer-course"></div>
      <main className="course">
        <section className="infobox">
          <article>
            <h1 className="course-headline">{course?.CourseName}</h1>
            <div className="course-actions">
              <button>
                <i className="fa-solid fa-right-from-bracket"></i>Austragen
              </button>
              <button>
                <i className="fa-regular fa-circle-check"></i>Abschließen
              </button>
            </div>
          </article>
          <aside>
            <table>
              <tr>
                <td>Semester:</td>
                <td>{course?.is_fwpm ? "FWPM" : course?.semester}</td>
              </tr>
              <tr>
                <td>Dozent:</td>
                <td>{course?.name}</td>
              </tr>
              <tr>
                <td>Raum:</td>
                <td>{course?.shortname}</td>
              </tr>
              <tr>
                <td>Typ:</td>
                <td>{course?.is_fwpm ? "FWPM" : "Pflichtmodul"}</td>
              </tr>
            </table>
          </aside>
        </section>
        <section className="content-box">
          <article className="course-chapter">
            <h2>{courseContent?.title ?? ""}</h2>
            <p>{courseContent?.text ?? ""}</p>
          </article>

          <article className="course-chapter"></article>
          {course?.x_coord !== undefined && course?.y_coord !== undefined ? (
            <MapContainer
              center={[course!.x_coord ?? 0, course!.y_coord ?? 0]}
              zoom={18}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[course!.x_coord ?? 0, course!.y_coord ?? 0]}>
                <Popup>
                  <strong>{course?.CourseName}</strong> <br />{" "}
                  <span>{course?.shortname}</span> {course?.time_range}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <></>
          )}
        </section>
      </main>
    </div>
  );
};

export default Course;
