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
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedTrip, setEditedTrip] = useState(null);
  const [updatedTripInfo, setUpdatedTripInfo] = useState({
    count: "",
    direction_id: "",
    route_id: "",
    service_id: "",
    shape_id: "",
    trip_id: "",
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const db = getFirestore();
        const tripsCollection = await getDocs(collection(db, "trips2"));
        const tripsData = tripsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    getTrips();
  }, []);

  const handleEdit = (trip) => {
    setEditedTrip(trip);
    setShowModal(true);
    setUpdatedTripInfo(trip);
  };

  const handleCloseModal = () => {
    setEditedTrip(null);
    setShowModal(false);
    setUpdatedTripInfo({
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
      const tripRef = doc(db, "trips2", editedTrip.id);
      await updateDoc(tripRef, updatedTripInfo);
      const updatedTrips = trips.map((trip) =>
        trip.id === editedTrip.id ? { ...trip, ...updatedTripInfo } : trip
      );
      setTrips(updatedTrips);
      handleCloseModal();
      toast.success("Trips updated successfully");
    } catch (error) {
      toast.error("Error while updating trips: ", error);
      console.log("Error while updating trips: ", error);
    }
  };

  const handleDelete = async (count) => {
    try {
      const db = getFirestore();
      const tripToDelete = trips.find((trip) => trip.count === count);
      if (!tripToDelete) {
        toast.error("Trip not found for count: " + count);
        return;
      }
      await deleteDoc(doc(db, "trips2", tripToDelete.id));
      const updatedTrips = trips.filter((trip) => trip.count !== count);
      setTrips(updatedTrips);
      toast.success("Trip deleted successfully for count: " + count);
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Error deleting trip for count: " + count);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allCount = trips.map((trip) => trip.count);
      setSelectedRows(allCount);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (count) => {
    const selectedIndex = selectedRows.indexOf(count);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, count);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = () => {
    selectedRows.forEach((count) => handleDelete(count));
    setSelectedRows([]);
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Trips_2 Data</h5>
            </div>
          </div>
          {selectedRows.length > 0 && (
            <div className="text-center mt-3">
              <Button variant="danger" onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
            </div>
          )}
          <Table striped bordered hover className="overflow-scroll">
            <thead>
              <tr>
                <th>
                  <Button variant="primary" onClick={handleSelectAll}>
                    {selectAll ? "Unselect All" : "Select All"}
                  </Button>
                </th>
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
              {trips.map((trip, index) => (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.indexOf(trip.count) !== -1}
                      onChange={() => handleSelectRow(trip.count)}
                    />
                  </td>
                  <td className="text-secondary">
                    <b>{trip.count}</b>
                  </td>
                  <td>{trip.direction_id}</td>
                  <td>{trip.route_id}</td>
                  <td>{trip.service_id}</td>
                  <td>{trip.shape_id}</td>
                  <td>{trip.trip_id}</td>
                  <td className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(trip)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(trip.count)}
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
          <Modal.Title>Edit Trips Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripInfo.count}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Direction Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripInfo.direction_id}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
                        direction_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripInfo.route_id}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
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
                    value={updatedTripInfo.service_id}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
                        service_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Shape_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripInfo.shape_id}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
                        shape_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Trip_Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedTripInfo.trip_id}
                    onChange={(e) =>
                      setUpdatedTripInfo({
                        ...updatedTripInfo,
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
