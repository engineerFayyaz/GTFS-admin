import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  writeBatch
} from "firebase/firestore";
import {
  Table,
  Form,
  Container,
  Col,
  Row,
  Modal,
  Button,
  Pagination,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchFilter from "../../components/SearchFilter";

function RoutesMobileData() {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedRoute, setEditedRoute] = useState(null);
  const [updatedRoute, setUpdatedRoute] = useState({
    count: "",
    route_color: "",
    route_id: "",
    route_long_name: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch routes from Firestore on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const db = getFirestore();
        const routesCollection = await getDocs(collection(db, "routes2"));
        const routesData = routesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle editing a route
  const handleEdit = (route) => {
    setEditedRoute(route);
    setUpdatedRoute(route);
    setShowModal(true);
  };

  // Function to close the edit modal
  const handleCloseModal = () => {
    setEditedRoute(null);
    setShowModal(false);
    setUpdatedRoute({
      count: "",
      route_color: "",
      route_id: "",
      route_long_name: "",
    });
  };

  // Function to save changes to a route
  const saveChanges = async () => {
    try {
      const db = getFirestore();
      const routeRef = doc(db, "routes2", editedRoute.id);
      await updateDoc(routeRef, updatedRoute);

      const updatedRoutes = routes.map((route) =>
        route.id === editedRoute.id ? { ...route, ...updatedRoute } : route
      );
      setRoutes(updatedRoutes);
      handleCloseModal();
      toast.success("Route updated successfully");
    } catch (error) {
      toast.error("Error while updating route:", error);
      console.error("Error while updating route:", error);
    }
  };

  // Function to handle deleting a route
  const handleDelete = async (routeId) => {
    try {
      setLoading(true);
      const db = getFirestore();
      await deleteDoc(doc(db, "routes2", routeId));
      setRoutes((prevRoutes) => prevRoutes.filter((route) => route.id !== routeId));
      toast.success("Route deleted successfully");
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Error deleting route");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle selection of a row
  const handleToggleRow = (routeId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(routeId)
        ? prevSelectedRows.filter((selectedRouteId) => selectedRouteId !== routeId)
        : [...prevSelectedRows, routeId]
    );
  };

  // Function to delete selected routes
  const handleDeleteSelected = async () => {
    const firestore = getFirestore();
    try {
      setLoading(true);
      const batch = writeBatch(firestore); // Corrected the method to create a batch
  
      selectedRows.forEach((routeId) => {
        const routeRef = doc(firestore, "routes2", routeId);
        batch.delete(routeRef);
      });
  
      await batch.commit();
  
      const updatedRoutes = routes.filter((route) => !selectedRows.includes(route.id));
      setRoutes(updatedRoutes);
      setSelectedRows([]);
      toast.success("Selected routes deleted successfully");
    } catch (error) {
      console.error("Error deleting selected routes:", error);
      toast.error("Error deleting selected routes");
    } finally {
      setLoading(false);
    }
  };

  
  


  // Function to select all rows
  const handleSelectAll = () => {
    setSelectedRows(routes.map((route) => route.id));
  };

  // Function to unselect all rows
  const handleUnselectAll = () => {
    setSelectedRows([]);
  };

  // Function to handle pagination click
  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const filteredRoutesData = routes.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    return ["routeColor", "routeId", "routeLongName"].some(
      (field) =>
        item[field]
          ? item[field].toLowerCase().includes(searchTermLower)
          : false
    );
  });
  // Calculate paginated routes based on currentPage and pageSize
  const paginatedRoutes = filteredRoutesData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <ToastContainer />
      <div className="container-fluid px-3 pt-4">
        <div className="row">
          <div className="col-lg-12 p-3">
            <div className="text-center">
              <h5 className="text-uppercase p-2 page-title">Routes Data</h5>
            </div>
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              fields={[
                "routeColor",
                "routeId",
                "routeLongName",
              ]}
            />
          </div>
          <div className="col-lg-12 p-3">
          <Button variant="danger" onClick={handleDeleteSelected} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  Deleting...
                </>
              ) : (
                "Delete Selected"
              )}
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
              {paginatedRoutes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(route.id)}
                      onChange={() => handleToggleRow(route.id)}
                    />
                  </td>
                  <td className="text-secondary">{route.count}</td>
                  <td>{route.route_color}</td>
                  <td>{route.route_id}</td>
                  <td>{route.route_long_name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(route)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDelete(route.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>
              {[...Array(Math.ceil(filteredRoutesData.length / pageSize)).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => handlePaginationClick(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
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

export default RoutesMobileData;
