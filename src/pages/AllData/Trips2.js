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

function Trips2() {
  const [Trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedTrips, setEditedTrips] = useState(null);
  const [updatedTripsInfo, setUpdatedTripsInfo] = useState({
    count: "",
    direction_id: "",
    route_id: "",
    service_id: "",
    shape_id: "",
    trip_id: "",
  });

  useEffect(() => {
    const getTrips = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const TripsCollection = await getDocs(
          collection(db, "trips2")
        );
        const TripsData = TripsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(TripsData);
        toast.success("data saved successfully");
      } catch (error) {
        console.error("Error fetching users:", error);
      }

    };

    getTrips();
  }, []);

  const handleEdit = (route) => {
    setEditedTrips(route);
    setShowModal(true);
    setUpdatedTripsInfo(route);
  };

  const handleCloseModal = () => {
    setEditedTrips(null);
    setShowModal(false);
    setUpdatedTripsInfo({
      count: "",
      direction_id: "",
      route_id: "",
      service_id: "",
      shape_id: "",
      trip_id: "",
    });
  };
  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips2", updatedTripsInfo.id);
      await updateDoc(tripRef, updatedTripsInfo);
      const updatedTrips = Trips.map((trip) =>
        trip.id === editedTrips.id ? { ...trip, ...updatedTrips } : trip
      );
      setTrips(updatedTrips);
      handleCloseModal();
      toast.success("Trips updated successfully");
    } catch (error) {
      toast.error(" Error while updating Routes: ", error);
      console.log(" Error while updating Routes: ", error);
    }
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Trips[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "trips2", user.id));
      // Remove the user from the state
      setTrips((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
            <h5 className="text-uppercase p-2 page-title">Trips_2 Data</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Direction Id</th>
              <th>Route Id</th>
              <th>Service Id</th>
              <th>Shape Id</th>
              <th>Trip Id</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            {Trips.map((trips, index) => (
              <tr key={index}>
                <td className="text-secondary">
                  <b>{trips.count}</b>
                </td>
                <td>{trips.direction_id}</td>
                <td>{trips.route_id}</td>
                <td>{trips.service_id}</td>
                <td>{trips.shape_id} </td>
                <td>{trips.trip_id} </td>
                <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(trips)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(trips)}>
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
          <Modal.Title>Edit Trips Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.count}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Direction Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.direction_id}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
                        direction_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.route_id}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
                        route_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Service_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.service_id}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
                        service_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Shape_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.shape_id}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
                        shape_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Trip_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripsInfo.trip_id}
                    onChange={(e) =>
                      setUpdatedTripsInfo({
                        ...updatedTripsInfo,
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

export default Trips2;
