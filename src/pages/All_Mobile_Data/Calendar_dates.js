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
  const [calendar, setCalendar] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [updatedCalendarInfo, setUpdatedCalendarInfo] = useState({
    date: "",
    exception_type: "",
    id: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore();
        const calendarCollection = await getDocs(collection(db, "calendar_dates2"));
        const calendarData = calendarCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCalendar(calendarData);
      } catch (error) {
        console.error("Error fetching calendar:", error);
      }
    };

    getCalendar();
  }, []);

  const handleEdit = (calendarItem) => {
    setEditingCalendar(calendarItem);
    setUpdatedCalendarInfo({
      date: calendarItem.date,
      id: calendarItem.id,
      exception_type: calendarItem.exception_type,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCalendar(null);
    setUpdatedCalendarInfo({
      date: "",
      exception_type: "",
      id: "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const calendarRef = doc(db, "calendar_dates2", editingCalendar.id);
      await updateDoc(calendarRef, updatedCalendarInfo);
      const updatedCalendars = calendar.map((calendarItem) =>
        calendarItem.id === editingCalendar.id ? { ...calendarItem, ...updatedCalendarInfo } : calendarItem
      );
      setCalendar(updatedCalendars);
      handleCloseModal();
      toast.success("Calendar updated successfully");
    } catch (error) {
      toast.error("Error updating calendar:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "calendar_dates2", id));
      setCalendar((prevCalendar) => prevCalendar.filter((calendarItem) => calendarItem.id !== id));
      toast.success("Calendar deleted successfully");
    } catch (error) {
      console.error("Error deleting calendar:", error);
      toast.error("Error deleting calendar");
    }
  };

  const handleToggleRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const db = getFirestore();

      for (const id of selectedRows) {
        await deleteDoc(doc(db, "calendar_dates2", id));
      }

      setCalendar((prevCalendar) => prevCalendar.filter((calendarItem) => !selectedRows.includes(calendarItem.id)));
      toast.success("Selected calendars deleted successfully");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting selected calendars:", error);
      toast.error("Error deleting selected calendars");
    }
  };

  const handleSelectAll = () => {
    setSelectedRows(calendar.map((calendarItem) => calendarItem.id));
  };

  const handleUnselectAll = () => {
    setSelectedRows([]);
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Calendar Dates</h5>
            </div>
          </div>
          <div className="col-lg-12 p-3">
            <Button variant="danger" onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
            <Button variant="info" onClick={handleSelectAll} className="ms-2">
              Select All
            </Button>
            <Button variant="info" onClick={handleUnselectAll} className="ms-2">
              Unselect All
            </Button>
          </div>
          <Table striped bordered hover className="overflow-scroll">
            <thead>
              <tr>
                <th>Select</th>
                <th>Date</th>
                <th>Exception Type</th>
                <th>Service Id</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((calendarItem) => (
                <tr key={calendarItem.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(calendarItem.id)}
                      onChange={() => handleToggleRow(calendarItem.id)}
                    />
                  </td>
                  <td className="text-secondary">{calendarItem.date}</td>
                  <td>{calendarItem.exception_type}</td>
                  <td>{calendarItem.id}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(calendarItem)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(calendarItem.id)}
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
      {/* Edit Calendar Modal */}
      <Modal
        show={showModal}
        size="lg"
        centered
        onHide={handleCloseModal}
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
                  <Form.Label>New Exception Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendarInfo.exception_type}
                    onChange={(e) =>
                      setUpdatedCalendarInfo({
                        ...updatedCalendarInfo,
                        exception_type: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendarInfo.id}
                    onChange={(e) =>
                      setUpdatedCalendarInfo({
                        ...updatedCalendarInfo,
                        id: e.target.value,
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
