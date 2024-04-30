import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Link } from "react-router-dom";
import {auth} from "../../src/firebase/Config.js"

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use Firebase Authentication to get a list of users
      const userList = await auth.listUsers();
      const userData = userList.users.map((user) => ({
        id: user.uid,
        email: user.email,
        // Add any other user data you want to display
      }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <>
      <div className="container-fluid px-3 pt-4">
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">Manage All Users</h2>
        </div>
        <div className="row ">
          <div className="col-lg-12 mt-4">
            <div className="mt-4">
              <div className="text-center  ">
                <h2 className="text-uppercase p-2 page-title">All Users</h2>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.email}</td>
                      {/* Display more user data in additional columns */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
