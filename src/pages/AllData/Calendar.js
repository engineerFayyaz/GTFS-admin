import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Table, Button, Modal, Form, Container, Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CalendarTwo() {
  const [Calendar, setCalendar] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectAllStatus, setSelectAllStatus] = useState("Select All");
  const [updatedCalendar, setUpdatedCalendar] = useState({
    startdate: "",
    count: "",
    enddate: "",
    serviceid: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore();
        const CalendarCollection = await getDocs(collection(db, "calendar2"));
        const CalendarData = CalendarCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCalendar(CalendarData);
      } catch (error) {
        console.error("Error fetching calendar:", error);
      }
    };

    getCalendar();
  }, []);

  const handleEdit = (calendar) => {
    setUpdatedCalendar(calendar);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdatedCalendar({
      startdate: "",
      count: "",
      enddate: "",
      serviceid: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    });
  };

  const handleToggleRow = (count) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(count)
        ? prevSelectedRows.filter((selectedCount) => selectedCount !== count)
        : [...prevSelectedRows, count]
    );
  };

  const handleDeleteRow = async (count) => {
    try {
      const db = getFirestore();
      const calendarToDelete = Calendar.find((calendar) => calendar.count === count);
      if (calendarToDelete) {
        await deleteDoc(doc(db, "calendar2", calendarToDelete.id));
        setCalendar((prevCalendar) => prevCalendar.filter((calendar) => calendar.count !== count));
        console.log("Calendar deleted successfully:", count);
      } else {
        console.error("Calendar with count", count, "not found.");
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAllStatus === "Select All") {
      setSelectedRows(Calendar.map((calendar) => calendar.count));
      setSelectAllStatus("Unselect All");
    } else {
      setSelectedRows([]);
      setSelectAllStatus("Select All");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const db = getFirestore();

      for (const count of selectedRows) {
        const calendarToDelete = Calendar.find((calendar) => calendar.count === count);
        if (calendarToDelete) {
          await deleteDoc(doc(db, "calendar2", calendarToDelete.id));
        } else {
          console.error("Calendar with count", count, "not found.");
        }
      }

      // Remove the deleted calendars from the state
      setCalendar((prevCalendar) =>
        prevCalendar.filter((calendar) => !selectedRows.includes(calendar.count))
      );

      console.log("Selected calendars deleted successfully:", selectedRows);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting selected calendars:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Calendar_02 Data</h5>
            </div>
          </div>

          {selectedRows.length > 0 && (
            <div className="text-center">
              <Button variant="danger" onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
            </div>
          )}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Button variant="primary" size="sm" onClick={handleSelectAll} style={{borderRadius:"15px"}}>
                    {selectAllStatus}
                  </Button>
                </th>
                <th>Count</th>
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
              {Calendar.map((calendar) => (
                <tr key={calendar.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(calendar.count)}
                      onChange={() => handleToggleRow(calendar.count)}
                    />
                  </td>
                  <td className="text-secondary">{calendar.count}</td>
                  <td>{calendar.startdate}</td>
                  <td>{calendar.enddate}</td>
                  <td>{calendar.serviceid}</td>
                  <td>{calendar.monday}</td>
                  <td>{calendar.tuesday}</td>
                  <td>{calendar.wednesday}</td>
                  <td>{calendar.thursday}</td>
                  <td>{calendar.friday}</td>
                  <td>{calendar.saturday}</td>
                  <td>{calendar.sunday}</td>
                  <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(calendar)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDeleteRow(calendar.count)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
         
        </div>
      </div>
      <Modal
        show={showModal}
        size="lg"
        centered
        onHide={handleCloseModal}
        large
        backdrop="static"
        className="editinfo_modal"
      >
        {/* Modal Content */}
      </Modal>
    </>
  );
}

export default CalendarTwo;
