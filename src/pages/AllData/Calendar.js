import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {Table, Form, Container, Col, Row, Modal, Button} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Calendar() {
  const [Calendar, setCalendar] = useState([]);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedCalendar, setUpdatedCalendar] = useState({
    startdate: "",
    count:"",
    enddate: "",
    serviceid:"",
    monday:"",
    tuesday: "",
    wednesday:"",
    thursday:"",
    friday:"",
    saturday:"",
    sunday:""
  })
  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const CalendarCollection = await getDocs(
          collection(db, "calendar")
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
   setUpdatedCalendar(calendar);
   setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCalendar(null);
    setShowModal(false);
    setUpdatedCalendar({
      startdate: "",
      count:"",
      enddate: "",
      serviceid:"",
      monday:"",
      tuesday: "",
      wednesday:"",
      thursday:"",
      friday:"",
      saturday:"",
      sunday:""
    })
  }
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

  const handleSaveChanges = async () => {
    const db = getFirestore();
    try {
      const calendarRef = doc(db, "calendar", editingCalendar.id);
      await updateDoc(calendarRef, updatedCalendar);

      const updatedCalendars = Calendar.map((calendar) => 
        calendar.id === editingCalendar.id
         ? {...calendar , ...updatedCalendar}
          : calendar
      );
      setCalendar(updatedCalendars);
      handleCloseModal()
      toast.success("User updated successfully:", editingCalendar);
    }
    catch (error) {
      toast.error("Error updating user:", error);
    }
  }

  return (
    <>
    <ToastContainer />
     <div className="container-fluid px-3 pt-4">
      <div className="row">
        <div className="col-lg-12 p-3">
          <div className="text-center  ">
            <h5 className="text-uppercase p-2 page-title">Calendar Data</h5>
          </div>
        </div>
        <Table striped bordered hover responsive className=" overflow-scroll  " >
          <thead>
            <tr>
              <th>Count</th>
              <th>Start_Date</th>
              <th>End_Date</th>
              <th>Service_Id</th>
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
            {Calendar.map((calendar, index) => (
              <tr key={index}>
                <td className="text-secondary"><b>{calendar.count}</b></td>
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
                  <Form.Label>New Starting Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.startdate}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        startdate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Ending Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.enddate}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        enddate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Service ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.serviceid}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        service_Id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
               
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Monday ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.monday}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        monday: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Tuseday ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.tuesday}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        tuesday: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Wednesday ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCalendar.wednesday}
                    onChange={(e) =>
                      setUpdatedCalendar({
                        ...updatedCalendar,
                        wednesday: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
               <Form.Group>
                 <Form.Label>New Saturday ID</Form.Label>
                 <Form.Control
                   type="text"
                   value={updatedCalendar.saturday}
                   onChange={(e) =>
                     setUpdatedCalendar({
                       ...updatedCalendar,
                       saturday: e.target.value,
                     })
                   }
                 />
               </Form.Group>
               <Form.Group>
                 <Form.Label>New Sunday ID</Form.Label>
                 <Form.Control
                   type="text"
                   value={updatedCalendar.sunday}
                   onChange={(e) =>
                     setUpdatedCalendar({
                       ...updatedCalendar,
                       sunday: e.target.value,
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

export default Calendar;
