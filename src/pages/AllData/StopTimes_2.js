import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Table,
  Button,
  Form,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap/";
import { db } from "../../Config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StopsTime2() {
  const [Stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedStops, setEditedStops] = useState(null);
  const [updatedStopsInfo, setUpdatedStopsInfo] = useState({
    count: "",
    arrival_time: "",
    departure_time: "",
    pickup_type: "",
    stop_id: "",
    stop_sequence: "",
    trip_id: ""
  });

  useEffect(() => {
    const getStops = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const StopsCollection = await getDocs(
          collection(db, "stop_times2")
        );
        const StopsData = StopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(StopsData);
        toast.success("data saved successfully");
      } catch (error) {
        console.error("Error fetching users:", error);
      }

    };

    getStops();
  }, []);

  const handleEdit = (route) => {
    setEditedStops(route);
    setShowModal(true);
    setUpdatedStopsInfo(route);
  };

  const handleCloseModal = () => {
    setEditedStops(null);
    setShowModal(false);
    setUpdatedStopsInfo({
      count: "",
      arrival_time: "",
      departure_time: "",
      pickup_type: "",
      stop_id: "",
      stop_sequence: "",
      trip_id: ""
    });
  };
  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const routeRef = doc(db, "stop_times2", updatedStopsInfo.id);
      await updateDoc(routeRef, updatedStopsInfo);
      const updatedStops = Stops.map((stop) =>
        stop.id === editedStops.id ? { ...stop, ...updatedStops } : stop
      );
      setStops(updatedStops);
      handleCloseModal();
      toast.success("route updated successfully");
    } catch (error) {
      toast.error(" Error while updating Routes: ", error);
      console.log(" Error while updating Routes: ", error);
    }
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Stops[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "stop_times2", user.id));
      // Remove the user from the state
      setStops((prevUsers) => prevUsers.filter((_, i) => i !== index));
      console.log("deleted successfully:", user);
    } catch (error) {
      console.error("Error deleting :", error);
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="container-fluid px-3 pt-4">
      <div className="row">
        <div className="col-lg-12 p-3">
          <div className="text-center  ">
            <h5 className="text-uppercase p-2 page-title">Stops_2 Time</h5>
          </div>
        </div>
        <Table striped bordered responsive hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Arrival Time</th>
              <th>Departure Time</th>
              <th>Stop Id</th>
              <th>Pickup Type</th>
              <th>Stop Sequence</th>
              <th>Trip Id</th>
              
            </tr>
          </thead>
          <tbody>
            {Stops.map((stops, index) => (
              <tr key={index}>
                <td className="text-secondary">
                  <b>{stops.count}</b>
                </td>
                <td>{stops.arrival_time}</td>
                <td>{stops.departure_time}</td>
                <td>{stops.stop_id}</td>
                <td>{stops.pickup_type} </td>
                <td>{stops.stop_sequence} </td>
                <td>{stops.trip_id} </td>
                <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(stops)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(stops)}>
                      Delete{" "}
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
          <Modal.Title>Edit Stops_1 Times </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.count}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Stops Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.stop_id}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        stop_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Arrival Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.arrival_time}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        arrival_time: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Departure Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.departure_time}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        departure_time: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Pick Up Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.pickup_type}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        pickup_type: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Stops Sequence</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.stop_sequence}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        stop_sequence: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Trip_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.trip_id}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        trip_id: e.target.value,
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

export default StopsTime2;
