import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const db = getFirestore();
        const usersCollection = await getDocs(collection(db, "RegisteredUsers"));
        const usersData = usersCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedUsername(user.username); // Set the initial value for the updated username
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setUpdatedUsername(""); // Reset the updated username
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "RegisteredUsers", editingUser.id);
      await updateDoc(userRef, { username: updatedUsername });
      // Update the user locally
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, username: updatedUsername } : user
      );
      setUsers(updatedUsers);
      handleCloseModal();
      console.log("User updated successfully:", editingUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (index) => {
    const user = users[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
      console.log("User deleted successfully:", user);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container-fluid px-3 pt-4">
      <div className="row">
        <div className="col-lg-12 p-3">
          <div className="text-center">
            <h5 className="text-uppercase p-2 page-title">Registered Users</h5>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Country</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.businessName}</td>
                <td>{user.country}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.username}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Edit User Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>New Username</Form.Label>
              <Form.Control
                type="text"
                value={updatedUsername}
                onChange={(e) => setUpdatedUsername(e.target.value)}
              />
            </Form.Group>
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
      </div>
    </div>
  );
}

export default UserList;
