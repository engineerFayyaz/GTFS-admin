import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Table, Form, Container, Col, Row, Modal, Button, Pagination } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchFilter from "../../components/SearchFilter";

export function CalendarWeb() {
  const [calendar, setCalendar] = useState([]);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedCalendar, setUpdatedCalendar] = useState({
    start_date: "",
    end_date: "",
    service_id: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    const fetchCalendar = async () => {
      const db = getFirestore();
      try {
        const calendarCollection = await getDocs(collection(db, "calendar-web-data"));
        const calendarData = calendarCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCalendar(calendarData);
      } catch (error) {
        console.error("Error fetching calendar:", error);
      }
    };
    fetchCalendar();
  }, []);

  const handleEdit = (calendar) => {
    setEditingCalendar(calendar);
    setUpdatedCalendar(calendar);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCalendar(null);
    setShowModal(false);
    setUpdatedCalendar({
      start_date: "",
      end_date: "",
      service_id: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    });
  };

  const handleDelete = async (countToDelete) => {
    try {
      const db = getFirestore();
      const calendarToDelete = calendar.find((item) => item.count === countToDelete);
      if (calendarToDelete) {
        await deleteDoc(doc(db, "calendar-web-data", calendarToDelete.id));
        setCalendar((prevCalendar) =>
          prevCalendar.filter((item) => item.count !== countToDelete)
        );
        console.log("Calendar deleted successfully:", calendarToDelete);
      } else {
        console.error("Calendar with count", countToDelete, "not found.");
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  const handleSaveChanges = async () => {
    const db = getFirestore();
    try {
      const calendarRef = doc(db, "calendar-web-data", editingCalendar.id);
      await updateDoc(calendarRef, updatedCalendar);

      const updatedCalendars = calendar.map((item) =>
        item.id === editingCalendar.id ? { ...item, ...updatedCalendar } : item
      );
      setCalendar(updatedCalendars);
      handleCloseModal();
      toast.success("Calendar updated successfully:", editingCalendar);
    } catch (error) {
      toast.error("Error updating calendar:", error);
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
        const calendarToDelete = calendar.find((item) => item.count === count);
        if (calendarToDelete) {
          await deleteDoc(doc(db, "calendar-web-data", calendarToDelete.id));
        } else {
          console.error("Calendar with count", count, "not found.");
        }
      }
      setCalendar((prevCalendar) =>
        prevCalendar.filter((item) => !selectedRows.includes(item.count))
      );
      console.log("Selected calendars deleted successfully:", selectedRows);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting selected calendars:", error);
    }
  };

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const filteredWebData = calendar.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    return ['service_id', 'end_date', 'start_date'].some((field) =>
      item[field]
        ? item[field].toLowerCase().includes(searchTermLower)
        : false
    );
  });

  const paginatedStops = filteredWebData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">
                Calendar Web Data
              </h5>
            </div>
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              field={['service_id', 'end_date', 'start_date']}
            />
          </div>
          <div className="col-lg-12 p-3">
            {selectedRows.length > 0 && (
              <Button variant="danger" onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
            )}
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Select</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Service ID</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStops.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.count)}
                      onChange={() => handleToggleRow(item.count)}
                    />
                  </td>
                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                  <td>{item.service_id}</td>
                  <td>{item.monday}</td>
                  <td>{item.tuesday}</td>
                  <td>{item.wednesday}</td>
                  <td>{item.thursday}</td>
                  <td>{item.friday}</td>
                  <td>{item.saturday}</td>
                  <td>{item.sunday}</td>
                  <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDelete(item.count)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePaginationClick(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {currentPage > 1 && (
                <Pagination.Item onClick={() => handlePaginationClick(currentPage - 1)}>
                  {currentPage - 1}
                </Pagination.Item>
              )}
              <Pagination.Item active>{currentPage}</Pagination.Item>
              {currentPage < Math.ceil(filteredWebData.length / pageSize) && (
                <Pagination.Item onClick={() => handlePaginationClick(currentPage + 1)}>
                  {currentPage + 1}
                </Pagination.Item>
              )}
              <Pagination.Next
                onClick={() => handlePaginationClick(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredWebData.length / pageSize)}
              />
            </Pagination>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        size="lg"
        centered
        onHide={handleCloseModal}
        backdrop="static"
        className="editinfo_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Route Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              {Object.keys(updatedCalendar).map((key) => (
                <Col key={key} md={6}>
                  <Form.Group>
                    <Form.Label>{key.replace(/_/g, " ")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={updatedCalendar[key]}
                      onChange={(e) =>
                        setUpdatedCalendar({
                          ...updatedCalendar,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              ))}
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

export default CalendarWeb;
