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
    service_Id: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore();
        const calendarCollection = await getDocs(
          collection(db, "calendar_dates")
        );
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
    setUpdatedCalendarInfo(calendarItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCalendar(null);
    setUpdatedCalendarInfo({
      date: "",
      service_Id: "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const calendarRef = doc(db, "calendar_dates", editingCalendar.id);
      await updateDoc(calendarRef, updatedCalendarInfo);
      const updatedCalendars = calendar.map((calendarItem) =>
        calendarItem.id === editingCalendar.id
          ? { ...calendarItem, ...updatedCalendarInfo }
          : calendarItem
      );
      setCalendar(updatedCalendars);
      handleCloseModal();
      toast.success("Calendar updated successfully:", editingCalendar);
    } catch (error) {
      toast.error("Error updating calendar:", error);
    }
  };

  const handleDelete = async (count) => {
    try {
      const db = getFirestore();
      const calendarToDelete = calendar.find((calendarItem) => calendarItem.count === count);
      if (calendarToDelete) {
        await deleteDoc(doc(db, "calendar_dates", calendarToDelete.id));
        setCalendar((prevCalendar) =>
          prevCalendar.filter((calendarItem) => calendarItem.count !== count)
        );
        console.log("Calendar deleted successfully:", calendarToDelete);
      } else {
        console.error("Calendar with count", count, "not found.");
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  const handleToggleRow = (count) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(count)
        ? prevSelectedRows.filter((selectedCount) => selectedCount !== count)
        : [...prevSelectedRows, count]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const db = getFirestore();

      for (const count of selectedRows) {
        const calendarToDelete = calendar.find((calendarItem) => calendarItem.count === count);
        if (calendarToDelete) {
          await deleteDoc(doc(db, "calendar_dates", calendarToDelete.id));
        } else {
          console.error("Calendar with count", count, "not found.");
        }
      }

      setCalendar((prevCalendar) =>
        prevCalendar.filter((calendarItem) => !selectedRows.includes(calendarItem.count))
      );
      console.log("Selected calendars deleted successfully:", selectedRows);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting selected calendars:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectedRows(calendar.map((calendarItem) => calendarItem.count));
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
            <div className="text-center  ">
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
                <th>Count</th>
                <th>Date</th>
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
                      checked={selectedRows.includes(calendarItem.count)}
                      onChange={() => handleToggleRow(calendarItem.count)}
                    />
                  </td>
                  <td className="text-secondary">{calendarItem.count}</td>
                  <td>{calendarItem.date}</td>
                  <td>{calendarItem.service_Id}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(calendarItem)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(calendarItem.count)}
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
