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

function StopsTime1() {
  const [stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedStop, setEditedStop] = useState(null);
  const [updatedStopInfo, setUpdatedStopInfo] = useState({
    count: "",
    arrival_time: "",
    departure_time: "",
    pickup_type: "",
    stop_id: "",
    stop_sequence: "",
    trip_id: "",
  });
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const getStops = async () => {
      try {
        const db = getFirestore();
        const stopsCollection = await getDocs(collection(db, "stop_times"));
        const stopsData = stopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(stopsData);
        toast.success("Data saved successfully");
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    getStops();
  }, []);

  const handleEdit = (stop) => {
    setEditedStop(stop);
    setShowModal(true);
    setUpdatedStopInfo(stop);
  };

  const handleCloseModal = () => {
    setEditedStop(null);
    setShowModal(false);
    setUpdatedStopInfo({
      count: "",
      arrival_time: "",
      departure_time: "",
      pickup_type: "",
      stop_id: "",
      stop_sequence: "",
      trip_id: "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const stopRef = doc(db, "stop_times", editedStop.id);
      await updateDoc(stopRef, updatedStopInfo);
      const updatedStops = stops.map((stop) =>
        stop.id === editedStop.id ? { ...stop, ...updatedStopInfo } : stop
      );
      setStops(updatedStops);
      handleCloseModal();
      toast.success("Stop times updated successfully");
    } catch (error) {
      toast.error("Error while updating stop times: ", error);
      console.log("Error while updating stop times: ", error);
    }
  };

  const handleDelete = async (index) => {
    const stop = stops[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "stop_times", stop.id));
      setStops((prevStops) => prevStops.filter((_, i) => i !== index));
      console.log("Deleted successfully:", stop);
    } catch (error) {
      console.error("Error deleting stop:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStops([]);
      setSelectAll(false);
    } else {
      const allStopIds = stops.map((stop) => stop.id);
      setSelectedStops(allStopIds);
      setSelectAll(true);
    }
  };

  const handleSelectStop = (id) => {
    if (selectedStops.includes(id)) {
      setSelectedStops(selectedStops.filter((stopId) => stopId !== id));
    } else {
      setSelectedStops([...selectedStops, id]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const db = getFirestore();
      for (const stopId of selectedStops) {
        await deleteDoc(doc(db, "stop_times", stopId));
      }
      setStops((prevStops) =>
        prevStops.filter((stop) => !selectedStops.includes(stop.id))
      );
      setSelectedStops([]);
      setSelectAll(false);
      toast.success("Selected stops deleted successfully");
    } catch (error) {
      console.error("Error deleting selected stops:", error);
      toast.error("Error deleting selected stops");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Stops Time 1</h5>
            </div>
          </div>
          {selectedStops.length > 0 && (
        <div className="container-fluid d-flex justify-content-end">
          <Button variant="danger" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}
          <Table striped bordered hover responsive className="overflow-scroll">
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Count</th>
                <th>Arrival Time</th>
                <th>Departure Time</th>
                <th>Stop Id</th>
                <th>Pickup Type</th>
                <th>Stop Sequence</th>
                <th>Trip Id</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {stops.map((stop, index) => (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedStops.includes(stop.id)}
                      onChange={() => handleSelectStop(stop.id)}
                    />
                  </td>
                  <td className="text-secondary">
                    <b>{stop.count}</b>
                  </td>
                  <td>{stop.arrival_time}</td>
                  <td>{stop.departure_time}</td>
                  <td>{stop.stop_id}</td>
                  <td>{stop.pickup_type}</td>
                  <td>{stop.stop_sequence}</td>
                  <td>{stop.trip_id}</td>
                  <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(stop)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(index)}>
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
          <Modal.Title>Edit Stop Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.count}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Stop Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.stop_id}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        stop_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Arrival Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.arrival_time}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        arrival_time: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Departure Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.departure_time}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        departure_time: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Pickup Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.pickup_type}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        pickup_type: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Stop Sequence</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.stop_sequence}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
                        stop_sequence: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Trip Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedStopInfo.trip_id}
                    onChange={(e) =>
                      setUpdatedStopInfo({
                        ...updatedStopInfo,
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

export default StopsTime1;
