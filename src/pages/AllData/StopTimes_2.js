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
import { toast } from "react-toastify";
import { ToastContainer } from "react-bootstrap";

function StopsTime2() {
  const [Stops, setStops] = useState([]);

  useEffect(() => {
    const getStops = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const StopsCollection = await getDocs(
          collection(db, "stop_times2")
        );
        const StopsData = StopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(StopsData);
        toast.success("data saved successfully");
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
    <>
    <ToastContainer />
    <div className="container-fluid px-3 pt-4">
      <div className="row">
        <div className="col-lg-12 p-3">
          <div className="text-center  ">
            <h5 className="text-uppercase p-2 page-title">Stops_2 Time</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Arrival Time</th>
              <th>Departure Time</th>
              <th>Stop Id</th>
              <th>Pickup Type</th>
              <th>Stop Sequence</th>
              <th>Trip Id</th>
              
            </tr>
          </thead>
          <tbody>
            {Stops.map((stops, index) => (
              <tr key={index}>
                <td className="text-secondary">
                  <b>{stops.count}</b>
                </td>
                <td>{stops.arrival_time}</td>
                <td>{stops.departure_time}</td>
                <td>{stops.stop_id}</td>
                <td>{stops.pickup_type} </td>
                <td>{stops.stop_sequence} </td>
                <td>{stops.trip_id} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    </>
  );
}

export default StopsTime2;
