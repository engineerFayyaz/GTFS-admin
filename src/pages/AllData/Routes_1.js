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
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedRoute, setEditedRoute] = useState(null);
  const [updatedRoute, setUpdatedRoute] = useState({
    count: "",
    route_color: " ",
    route_id: "",
    route_long_name: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const db = getFirestore(); 
        const routesCollection = await getDocs(collection(db, "routes"));
        const routesData = routesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    getRoutes();
  }, []);

  const handleEdit = (route) => {
    setEditedRoute(route);
    setUpdatedRoute(route);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditedRoute(null);
    setShowModal(false);
    setUpdatedRoute({
      count: "",
      route_color: " ",
      route_id: "",
      route_long_name: "",
    });
  };

  const saveChanges = async () => {
    try {
      const db = getFirestore();
      const routeRef = doc(db, "routes", editedRoute.id);
      await updateDoc(routeRef, updatedRoute);

      const updatedRoutes = routes.map((route) =>
        route.id === editedRoute.id ? { ...route, ...updatedRoute } : route
      );
      setRoutes(updatedRoutes);
      handleCloseModal();
      toast.success("Routes updated successfully");
    } catch (error) {
      toast.error("Error while updating routes:", error);
      console.log("Error while updating routes:", error);
    }
  };

  const handleDelete = async (count) => {
    try {
      const db = getFirestore();
      const routeToDelete = routes.find((route) => route.count === count);
      if (routeToDelete) {
        await deleteDoc(doc(db, "routes", routeToDelete.id));
        setRoutes((prevRoutes) =>
          prevRoutes.filter((route) => route.count !== count)
        );
        console.log("Route deleted successfully:", routeToDelete);
      } else {
        console.error("Route with count", count, "not found.");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
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
        const routeToDelete = routes.find((route) => route.count === count);
        if (routeToDelete) {
          await deleteDoc(doc(db, "routes", routeToDelete.id));
        } else {
          console.error("Route with count", count, "not found.");
        }
      }

      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => !selectedRows.includes(route.count))
      );
      console.log("Selected routes deleted successfully:", selectedRows);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting selected routes:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectedRows(routes.map((route) => route.count));
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
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Routes Data</h5>
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
          <Table striped bordered hover responsive className="overflow-scroll">
            <thead>
              <tr>
                <th>Select</th>
                <th>Count</th>
                <th>Route Color</th>
                <th>Route Id</th>
                <th>Route Long Name</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(route.count)}
                      onChange={() => handleToggleRow(route.count)}
                    />
                  </td>
                  <td className="text-secondary">{route.count}</td>
                  <td>{route.route_color}</td>
                  <td>{route.route_id}</td>
                  <td>{route.route_long_name}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(route)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(route.count)}
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
          <Modal.Title>Edit Routes Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoute.count}
                    onChange={(e) =>
                      setUpdatedRoute({
                        ...updatedRoute,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route Color</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoute.route_color}
                    onChange={(e) =>
                      setUpdatedRoute({
                        ...updatedRoute,
                        route_color: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Route ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoute.route_id}
                    onChange={(e) =>
                      setUpdatedRoute({
                        ...updatedRoute,
                        route_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Route Long Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedRoute.route_long_name}
                    onChange={(e) =>
                      setUpdatedRoute({
                        ...updatedRoute,
                        route_long_name: e.target.value,
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
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RoutesData;
