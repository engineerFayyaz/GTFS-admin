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

function Trips1() {
  const [Trips, setTrips] = useState([]);

  useEffect(() => {
    const getTrips = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const TripsCollection = await getDocs(
          collection(db, "trips")
        );
        const TripsData = TripsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(TripsData);
        toast.success("data saved successfully");
      } catch (error) {
        console.error("Error fetching users:", error);
      }

    };

    getTrips();
  }, []);

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = Trips[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log("Edit user:", user);
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Trips[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setTrips((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
            <h5 className="text-uppercase p-2 page-title">Trips_1 Time</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Direction Id</th>
              <th>Route Id</th>
              <th>Service Id</th>
              <th>Shape Id</th>
              <th>Trip Id</th>
            </tr>
          </thead>
          <tbody>
            {Trips.map((trips, index) => (
              <tr key={index}>
                <td className="text-secondary">
                  <b>{trips.count}</b>
                </td>
                <td>{trips.direction_id}</td>
                <td>{trips.route_id}</td>
                <td>{trips.service_id}</td>
                <td>{trips.shape_id} </td>
                <td>{trips.trip_id} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    </>
  );
}

export default Trips1;
