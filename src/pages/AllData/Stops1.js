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
import { db } from "../../Config";
function Stops1() {
  const [Stops, setStops] = useState([]);

  useEffect(() => {
    const getStops = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const StopsCollection = await getDocs(
          collection(db, "stops")
        );
        const StopsData = StopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(StopsData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }

    };

    getStops();
  }, []);

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = Stops[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log("Edit user:", user);
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Stops[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setStops((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
            <h5 className="text-uppercase p-2 page-title">Stops_1 Data</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Stops Id</th>
              <th>Stops_lat</th>
              <th>Stops_lon</th>
              <th>Stops_Name</th>
              <th>Zone_Id</th>
            </tr>
          </thead>
          <tbody>
            {Stops.map((stops, index) => (
              <tr key={index}>
                <td className="text-secondary">
                  <b>{stops.count}</b>
                </td>
                <td>{stops.stop_id}</td>
                <td>{stops.stop_lat}</td>
                <td>{stops.stop_lon}</td>
                <td>{stops.stop_name} </td>
                <td>{stops.zone_id} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Stops1;
