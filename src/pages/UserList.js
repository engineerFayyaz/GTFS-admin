import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const usersCollection = await getDocs(collection(db, 'RegisteredUsers'));
        const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = users[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log('Edit user:', user);
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = users[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'RegisteredUsers', user.id));
      // Remove the user from the state
      setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      console.log('User deleted successfully:', user);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Registered Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Country</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Username</th>
            <th>Actions</th> {/* New column for actions */}
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
                {/* Buttons for edit and delete */}
                <Button variant="primary" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserList;
