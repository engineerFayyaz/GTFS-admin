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
  Form,
  Container,
  Col,
  Row,
  Modal,
  Button,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RoutesData() {
  const [Routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedRoutes, setEditedRoutes] = useState(null);
  const [updatedRoutes, setUpdatedRoutes] = useState({
    count: "",
    route_color: " ",
    route_id: "",
    rout_long_name: "",
  });

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const RoutesCollection = await getDocs(collection(db, "routes"));
        const RoutesData = RoutesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutes(RoutesData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getRoutes();
  }, []);

  const handleEdit = (route) => {
    setEditedRoutes(route);
    setUpdatedRoutes(route);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setEditedRoutes(null);
    setShowModal(false);
    setUpdatedRoutes({
      count: "",
      route_color: " ",
      route_id: "",
      route_long_name: "",
    });
  };

  const saveChanges = async () => {
    try {
      const db = getFirestore();
      const RouteRef = doc(db, "routes", editedRoutes.id);
      await updateDoc(RouteRef, updatedRoutes);

      const updatedRoute = Routes.map((route) =>
        route.id === editedRoutes.id ? { ...route, ...updatedRoutes } : route
      );
      setRoutes(updatedRoute);
      handleCloseModal();
      toast.success("Routes updated sucessfully");
    } catch (error) {
      toast.error(" Error while updating Routes: ", error);
      console.log(" Error while updating Routes: ", error);
    }
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Routes[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setRoutes((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
              <h5 className="text-uppercase p-2 page-title">Routes Data</h5>
            </div>
          </div>
          <Table striped bordered hover responsive className=" overflow-scroll  ">
            <thead>
              <tr>
                <th>Count</th>
                <th>Route Color</th>
                <th>Route Id</th>
                <th>Route Long Name</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {Routes.map((routes, index) => (
                <tr key={index}>
                  <td className="text-secondary">
                    <b>{routes.count}</b>
                  </td>
                  <td>{routes.route_color}</td>
                  <td>{routes.route_id}</td>
                  <td>{routes.route_long_name}</td>
                  <td className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(routes)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(routes)}
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
                  <Form.Label>New Count </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoutes.count}
                    onChange={(e) => 
                      setUpdatedRoutes({
                        ...updatedRoutes,
                        count: e.target.value
                    })
                  }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route Color</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoutes.route_color}
                    onChange={(e) => setUpdatedRoutes({
                      ...updatedRoutes,
                      route_color: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Route ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoutes.route_id}
                    onChange={(e) => setUpdatedRoutes({
                      ...updatedRoutes,
                      route_id: e.target.value
                    })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route Long Name</Form.Label>
                  <Form.Control
                    type="text"
                   value={updatedRoutes.route_long_name}
                   onChange={(e) => setUpdatedRoutes({
                    ...updatedRoutes,
                    route_long_name: e.target.value
                   })}
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
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RoutesData;
