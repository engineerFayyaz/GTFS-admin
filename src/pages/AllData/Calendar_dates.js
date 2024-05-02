import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Container, Row, Modal, Form, Button, Table } from "react-bootstrap";

function CalendarDates() {
  const [Calendar, setCalendar] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [updatedCalendarInfo, setUpdatedCalendarInfo] = useState({
    date: "",
    service_Id: "",
  });

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const CalendarCollection = await getDocs(
          collection(db, "calendar_dates")
        );
        const CalendarData = CalendarCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCalendar(CalendarData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getCalendar();
  }, []);

  const handleEdit = (calendar) => {
    setEditingCalendar(calendar);
    setUpdatedCalendarInfo(calendar);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCalendar(null);
    setUpdatedCalendarInfo({
      date: "",
      service_id: "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const calendarRef = doc(db, "calendar_dates", editingCalendar.id);
      await updateDoc(calendarRef, updatedCalendarInfo);
      const updatedCalendars = Calendar.map((calendar) =>
        calendar.id === editingCalendar.id
          ? { ...calendar, ...updatedCalendarInfo }
          : calendar
      );
      setCalendar(updatedCalendars);
      handleCloseModal();
      toast.success("User updated successfully:", editingCalendar);
    } catch (error) {
      toast.error("Error updating user:", error);
    }
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Calendar[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setCalendar((prevUsers) => prevUsers.filter((_, i) => i !== index));
      console.log("User deleted successfully:", user);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center  ">
              <h5 className="text-uppercase p-2 page-title">Calendar Dates</h5>
            </div>
          </div>
          <Table striped bordered hover className=" overflow-scroll  ">
            <thead>
              <tr>
                <th>Count</th>
                <th>Date</th>
                <th>Service Id</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {Calendar.map((calendar, index) => (
                <tr key={index}>
                  <td className="text-secondary">
                    <b>{calendar.count}</b>
                  </td>
                  <td>{calendar.date}</td>
                  <td>{calendar.service_Id}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(calendar)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(calendar)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Edit User Modal */}
      <Modal
        show={showModal}
        size="lg"
        centered
        onHide={handleCloseModal}
        large
        backdrop="static"
        className="editinfo_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Calendar Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendarInfo.date}
                    onChange={(e) =>
                      setUpdatedCalendarInfo({
                        ...updatedCalendarInfo,
                        date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Service ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendarInfo.service_Id}
                    onChange={(e) =>
                      setUpdatedCalendarInfo({
                        ...updatedCalendarInfo,
                        service_Id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CalendarDates;
