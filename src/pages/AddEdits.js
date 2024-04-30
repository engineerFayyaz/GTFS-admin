import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const cloudinaryConfig = {
  cloudName: "lms-empty",
  apiKey: "465825886714436",
  apiSecret: "_XtyARctyPki8NutUmKpElof_Cw",
  uploadPreset: "vikings",
  uploadUrl: "https://api.cloudinary.com/v1_1/lms-empty/image/upload",
};

const AddEdits = () => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [edits, setEdits] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEdits();
  }, []);

  const fetchEdits = async () => {
    try {
      const response = await axios.get(
        "https://circularclientapi.azurewebsites.net/api/product-edits"
      );
      setEdits(response.data.results);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch edits. Please try again later.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);

        const response = await axios.post(cloudinaryConfig.uploadUrl, formData);
        if (response.status === 200) {
          setImageUrl(response.data.secure_url);
        } else {
          setError("Failed to upload image. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(
          "An error occurred while uploading image. Please try again later."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://circularclientapi.azurewebsites.net/api/product-edits",
        {
          name: name,
          detail: detail,
          imageUrl: imageUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Product Edit added successfully!");
        setName("");
        setDetail("");
        setImageUrl("");
        setError(null);
        fetchEdits(); // Fetch edits again after adding a new one
      } else {
        setError("Failed to add Product Edit. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while adding Product Edit. Please try again later."
      );
    }
  };

  const handleEdit = (editId) => {
    setEditingId(editId);
  };

  const handleSaveEdit = async (editId) => {
    // Implement logic to save the edit with the given editId
    setEditingId(null); // After saving, reset the editingId
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (editId) => {
    try {
      const response = await axios.delete(
        `https://circularclientapi.azurewebsites.net/api/product-edits/${editId}`
      );
      if (response.status === 200) {
        setEdits(edits.filter((edit) => edit.id !== editId));
        setSuccessMessage("Product Edit deleted successfully!");
        setError(null);
      } else {
        setError("Failed to delete Product Edit. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while deleting Product Edit. Please try again later."
      );
    }
  };

  return (
    <>
      <div className="container-fluid px-3 pt-4">
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">Manage All Edits</h2>
        </div>
        <div className="row ">
          <div className="col-lg-10 mt-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <b>Edit Name</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product type"
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <b>Edit Details</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Product details"
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <b>Edit Image</b>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                    required
                  />
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    <FontAwesomeIcon icon={faCamera} size="lg" />
                  </Button>
                </div>
                <Button type="submit" className="my-3">
                  Submit
                </Button>
              </Form.Group>

              {error && <p style={{ color: "red" }}>{error}</p>}
              {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
              )}
            </Form>

            <div className="text-center  ">
              <h2 className="text-uppercase p-2 page-title">All Edits</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Detail</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {edits.map((edit) => (
                  <tr key={edit.id}>
                    <td>
                      {editingId === edit.id ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      ) : (
                        edit.name
                      )}
                    </td>
                    <td>
                      {editingId === edit.id ? (
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => setDetail(e.target.value)}
                        />
                      ) : (
                        edit.detail
                      )}
                    </td>
                    <td>
                      <img
                        src={edit.imageUrl}
                        alt={edit.name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      {editingId === edit.id ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => handleSaveEdit(edit.id)}
                            className="my-3"
                          >
                            Save
                          </Button>
                          <Button variant="danger" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(edit.id)}
                            className="my-3"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(edit.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEdits;
