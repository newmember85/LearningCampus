import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useRecoilState } from "recoil";
import {
  announcementsAtom,
  authAtom,
  isStudentAtom,
} from "./application/Atoms";
import { ReceiveAnnouncement } from "./domain/receive-announcement";
import { SendAnnouncement } from "./domain/send-announcement";

const Notifications: React.FC = () => {
  function closeNotifications() {
    const notifications = document.getElementById("notification-sidebar");
    notifications?.classList.remove("shown");
  }

  const [announcements, setAnnouncements] = useRecoilState(announcementsAtom);

  const [isStudent] = useRecoilState(isStudentAtom);

  const { sendMessage, lastMessage } = useWebSocket("ws://localhost:1234");

  const [state, setState] = useState({
    title: "",
    text: "",
    course: "",
    degree: "",
    token: "",
  });
  const [token] = useRecoilState(authAtom);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openAnnouncement = (event: any) => {
    event.currentTarget.classList.toggle("expanded");
    event.currentTarget.setReadState({ read: true });
  };

  const handleSubmit = async (event: FormEvent) => {
    setShow(false);
    console.log("Submitting Form");

    event.preventDefault();
    const sendToWebsocket: SendAnnouncement = JSON.parse(JSON.stringify(state));
    sendToWebsocket.token = token[0];
    sendMessage(JSON.stringify(sendToWebsocket));
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  // Load Announcements from Database
  useEffect(() => {
    fetch("http://localhost:8080/api/announcement/all")
      .then((response) => response.text())
      .then((text) => {
        const receivedAnnouncements: ReceiveAnnouncement[] = JSON.parse(text);
        // reverse needed, because newest at the top
        setAnnouncements(receivedAnnouncements.reverse());
      });
  }, [setAnnouncements]);

  useEffect(() => {
    if (lastMessage !== null) {
      let data: ReceiveAnnouncement[] = [];
      try {
        data = JSON.parse(lastMessage.data);
      } catch (e) {
        console.log(e);
      }
      console.log(lastMessage);
      // reverse needed, because newest at the top
      setAnnouncements(data.reverse());
    }
  }, [lastMessage, setAnnouncements]);

  return (
    <aside id="notification-sidebar" className="">
      <div className="top">
        <button className="close-sidebar" onClick={() => closeNotifications()}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3>Ankündigungen</h3>
        {!isStudent ? (
          <Button className="new-announcement" onClick={handleShow}>
            <i className="fa-solid fa-square-plus"></i>
          </Button>
        ) : (
          <div></div>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Neue Ankündigung</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="announcement.subject">
              <Form.Label>Titel</Form.Label>
              <Form.Control
                placeholder="Ihr Titel.."
                autoFocus
                name="title"
                value={state.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="announcement.message">
              <Form.Label>Nachricht</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ihre Nachricht.."
                name="text"
                value={state.text}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="announcement.course">
              <Form.Label>Kurs</Form.Label>
              <Form.Control
                placeholder="Bitte zugehörigen Kurs eintragen"
                name="course"
                value={state.course}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="announcement.degree">
              <Form.Label>Studiengang</Form.Label>
              <Form.Control
                placeholder="Bitte zugehörigen Studiengang eintragen"
                name="degree"
                value={state.degree}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
            Senden
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="notification-list">
        <ul>
          {announcements.map((announcement) => {
            return (
              <li
                className="notification"
                onClick={openAnnouncement}
                key={
                  announcement.date +
                  announcement.title +
                  announcement.text +
                  Date.now +
                  Math.random()
                }
              >
                <div className="notification-head">
                  <h4 className="notification-subject">{announcement.title}</h4>
                  <p className="notification-date">{announcement.date}</p>
                </div>
                <h5 className="notification-sender">{announcement.name}</h5>
                <p className="notification-content">{announcement.text}</p>
                <button className="notification-shrink">
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Notifications;
