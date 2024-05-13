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

function Shapes2() {
  const [Shapes, setShapes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedShapes, setEditedShapes] = useState(null);
  const [updatedShapesInfo, setUpdatedShapesInfo] = useState({
    count: "",
    shape_id: "",
    shape_pt_lat: "",
    shape_pt_lon: "",
    shape_pt_sequence: "",
  });

  useEffect(() => {
    const getShapes = async () => {
      try {
        const ShapesData = collection(db, "shapes2");
        const querySnapshot = await getDocs(ShapesData);

        const fetchedData = [];

        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        //
        setShapes(fetchedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getShapes();
  }, []);

  const handleEdit = (route) => {
    setEditedShapes(route);
    setShowModal(true);
    setUpdatedShapesInfo(route);
  };

  const handleCloseModal = () => {
    setEditedShapes(null);
    setShowModal(false);
    setUpdatedShapesInfo({
      count: "",
      shape_id: "",
      shape_pt_lat: "",
      shape_pt_lon: "",
      shape_pt_sequence: "",
    });
  };
  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const routeRef = doc(db, "shapes2", editedShapes.id);
      await updateDoc(routeRef, updatedShapesInfo);
      const updatedShapes = Shapes.map((stop) =>
        stop.id === editedShapes.id ? { ...stop, ...updatedShapesInfo } : stop
      );
      setShapes(updatedShapes);
      handleCloseModal();
      toast.success("route updated successfully");
    } catch (error) {
      toast.error(" Error while updating Routes: ", error);
      console.log(" Error while updating Routes: ", error);
    }
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Shapes[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "shapes2", user.id));
      // Remove the user from the state
      setShapes((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
              <h5 className="text-uppercase p-2 page-title">Shapes_2 Data</h5>
            </div>
          </div>
          <Table striped bordered hover className=" overflow-scroll  ">
            <thead>
              <tr>
                <th>Count</th>
                <th>Shape Id</th>
                <th>Shape_pt_lat</th>
                <th>Shape_pt_lon</th>
                <th>Shape_pt_sequence</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {Shapes.map((shapes) => (
                <tr key={shapes.id}>
                  <td className="text-secondary">
                    <b>{shapes.count}</b>
                  </td>
                  <td>{shapes.shape_id}</td>
                  <td>{shapes.shape_pt_lat}</td>
                  <td>{shapes.shape_pt_lon}</td>
                  <td>{shapes.shape_pt_sequence} </td>
                  <td className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleEdit(shapes)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(shapes)}>
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
          <Modal.Title>Edit Shapes_1 Data </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="gap-3">
              <Col>
                <Form.Group>
                  <Form.Label>New Count </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedShapesInfo.count}
                    onChange={(e) =>
                      setUpdatedShapesInfo({
                        ...updatedShapesInfo,
                        count: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Shapes Id</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedShapesInfo.shape_id}
                    onChange={(e) =>
                      setUpdatedShapesInfo({
                        ...updatedShapesInfo,
                        shape_id: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Shap_pt-lat</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedShapesInfo.shape_pt_lat}
                    onChange={(e) =>
                      setUpdatedShapesInfo({
                        ...updatedShapesInfo,
                        shape_pt_lat: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>New Shape_pt-lon </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedShapesInfo.shape_pt_lon}
                    onChange={(e) =>
                      setUpdatedShapesInfo({
                        ...updatedShapesInfo,
                        shape_pt_lon: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Shape Sequence</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedShapesInfo.shape_pt_sequence}
                    onChange={(e) =>
                      setUpdatedShapesInfo({
                        ...updatedShapesInfo,
                        shape_pt_sequence: e.target.value,
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

export default Shapes2;
