import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function RoutesData2() {
  const [Routes, setRoutes] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const RoutesCollection = await getDocs(
          collection(db, "routes2")
        );
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

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = Routes[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log("Edit user:", user);
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
    <div className="container-fluid px-3 pt-4">
      <div className="row">
        <div className="col-lg-12 p-3">
          <div className="text-center  ">
            <h5 className="text-uppercase p-2 page-title">Routes_2 Data</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  " >
          <thead>
            <tr>
              <th>Count</th>
              <th>Route Color</th>
              <th>Route Id</th>
              <th>Route Long Name</th>
            </tr>
          </thead>
          <tbody>
            {Routes.map((routes, index) => (
              <tr key={index}>
                <td className="text-secondary"><b>{routes.count}</b></td>
                <td>{routes.route_color}</td>
                <td>{routes.route_id}</td>
                <td>{routes.route_long_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default RoutesData2;
