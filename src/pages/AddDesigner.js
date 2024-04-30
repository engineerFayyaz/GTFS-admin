import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import axios from "axios";

let schema = yup.object().shape({
  title: yup.string().required("Brand Name is Required"),
});
const AddDesigner = () => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [designers, setDesigners] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingDesignerId, setEditingDesignerId] = useState(null); // Track the ID of the designer being edited
  const [editableRows, setEditableRows] = useState({}); // Track which rows are in edit mode

  // Fetch designers on component mount
  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const response = await axios.get(
        "https://circularclientapi.azurewebsites.net/api/product-designers"
      );
      console.log("Response data:", response.data); // Log the response data
      const designersData = response.data.results || []; // Extract designers array from the results property
      setDesigners(designersData);
    } catch (error) {
      console.error("Error fetching designers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingDesignerId) {
        // If editingDesignerId is set, it means we are updating an existing designer
        response = await axios.put(
          `https://circularclientapi.azurewebsites.net/api/product-designers/${editingDesignerId}`,
          {
            name: name,
            detail: detail,
          }
        );
      } else {
        // Otherwise, we are adding a new designer
        response = await axios.post(
          "https://circularclientapi.azurewebsites.net/api/product-designers",
          {
            name: name,
            detail: detail,
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          editingDesignerId
            ? "Designer updated successfully!"
            : "Designer added successfully!"
        );
        setName("");
        setDetail("");
        setEditingDesignerId(null); // Reset editing mode
        fetchDesigners(); // Fetch designers again after adding/editing
      } else {
        setError(
          editingDesignerId
            ? "Failed to update designer. Please try again later."
            : "Failed to add designer. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleEdit = (designerId) => {
    setEditableRows((prevEditableRows) => ({
      ...prevEditableRows,
      [designerId]: true, // Set the row with designerId to editable
    }));
    const designerToEdit = designers.find(
      (designer) => designer.id === designerId
    );
    if (designerToEdit) {
      setName(designerToEdit.name);
      setDetail(designerToEdit.detail);
      setEditingDesignerId(designerId);
    }
  };

  const handleSave = () => {
    setEditableRows({}); // Clear all editable rows
    setEditingDesignerId(null); // Reset editing mode
    // Perform save operation here if needed
  };

  const handleCancel = () => {
    setEditableRows({}); // Clear all editable rows
    setEditingDesignerId(null); // Reset editing mode
    // Reset form fields here if needed
  };

  const handleDelete = async (designerId) => {
    try {
      const response = await axios.delete(
        `https://circularclientapi.azurewebsites.net/api/product-designers/${designerId}`
      );
  
      if (response.status === 200) {
        setSuccessMessage("Designer deleted successfully!");
        fetchDesigners(); // Fetch designers again after deleting one
      } else {
        setError("Failed to delete designer. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container-fluid px-3 pt-4">
    <div className="text-center  ">
      <h2 className="text-uppercase p-2 page-title">
        add Designer
      </h2>
    </div>
    <div className="row">
      <div className="col-lg-12 mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label><b>Designer name</b> </Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label><b>Designer Details</b></Form.Label>
            <Form.Control as="textarea" rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} required />
          </Form.Group>
          <Button type="submit">
            {editingDesignerId ? "Update" : "Submit"}
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </Form>
        <div>
          <div className="mt-5">
          <div className="text-center  ">
      <h2 className="text-uppercase p-2 page-title">
        MANAGE ALL DESIGNER
      </h2>
    </div>
          <table className="table bg-light">
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {designers.map((designer) => (
                <tr key={designer.id}>
                  <td className="w-25">
                    {editableRows[designer.id] ? (
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      designer.name
                    )}
                  </td>
                  <td className="w-50">
                    {editableRows[designer.id] ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                      />
                    ) : (
                      designer.detail
                    )}
                  </td>
                  <td className="w-25 bg-light d-flex align-items-center gap-2 w-100"
                  
                  
                  >
                    {editableRows[designer.id] ? (
                      <>
                        <Button onClick={() => handleSave()} variant="success">
                          Save
                        </Button>
                        <Button onClick={() => handleCancel()} variant="secondary">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleEdit(designer.id)}
                        disabled={editingDesignerId !== null}
                      >
                        Edit
                      </Button>


                      
                    )}
                     <Button onClick={() => handleDelete(designer.id)} variant="danger" className="ml-3">
                        Delete
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AddDesigner;
