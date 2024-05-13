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
function Stops2() {
  const [Stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedStops, setEditedStops] = useState(null);
  const [updatedStopsInfo, setUpdatedStopsInfo] = useState({
    count: "",
    stops_id: "",
    stops_lat: "",
    stops_lon: "",
    stops_name: "",
    zone_id: "",
  });

  useEffect(() => {
    const getStops = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const StopsCollection = await getDocs(collection(db, "stops2"));
        const StopsData = StopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(StopsData);
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
      stop_id: "",
      stop_lat: "",
      stop_lon: "",
      stop_name: "",
      zone_id: "",
    });
  };
  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const routeRef = doc(db, "stops2", editedStops.id);
      await updateDoc(routeRef, updatedStopsInfo);
      const updatedStops = Stops.map((stop) =>
        stop.id === editedStops.id ? { ...stop, ...updatedStopsInfo } : stop
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
      await deleteDoc(doc(db, "stops2", user.id));
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
              <h5 className="text-uppercase p-2 page-title">Stops_2 Data</h5>
            </div>
          </div>
          <Table striped bordered hover responsive className=" overflow-scroll  ">
            <thead>
              <tr>
                <th>Count</th>
                <th>Stops Id</th>
                <th>Stops_lat</th>
                <th>Stops_lon</th>
                <th>Stops_Name</th>
                <th>Zone_Id</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {Stops.map((stops, index) => (
                <tr key={index}>
                  <td className="text-secondary">
                    <b>{stops.count}</b>
                  </td>
                  <td>{stops.stop_id}</td>
                  <td>{stops.stop_lat}</td>
                  <td>{stops.stop_lon}</td>
                  <td>{stops.stop_name} </td>
                  <td>{stops.zone_id} </td>
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
          <Modal.Title>Edit Stops Info</Modal.Title>
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
                  <Form.Label>New Stops_lat</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.stop_lat}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        stop_lat: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Stops_long</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.stop_lon}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        stop_lon: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Stops_Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.stop_name}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        stop_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Zone_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopsInfo.zone_id}
                    onChange={(e) =>
                      setUpdatedStopsInfo({
                        ...updatedStopsInfo,
                        zone_id: e.target.value,
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

export default Stops2;
