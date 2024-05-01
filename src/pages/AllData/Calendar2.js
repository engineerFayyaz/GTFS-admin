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

function CalendarTwo() {
  const [Calendar, setCalendar] = useState([]);

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly here
        const CalendarCollection = await getDocs(
          collection(db, "calendar2")
        );
        const CalendarData = CalendarCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCalendar(CalendarData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getCalendar();
  }, []);

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = Calendar[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log("Edit user:", user);
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Calendar[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setCalendar((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
            <h5 className="text-uppercase p-2 page-title">Calendar_02 Data</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  " >
          <thead>
            <tr>
              <th>Count</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Service Id</th>
              <th>Monday</th>
              <th>Tuesday</th> 
              <th>Wednesday</th>
              <th>Thursday</th> 
              <th>Friday</th>
              <th>Saturday</th> 
              <th>Sunday</th> 
            </tr>
          </thead>
          <tbody>
            {Calendar.map((calendar, index) => (
              <tr key={index}>
                <td className="text-secondary"><b>{calendar.count}</b></td>
                <td>{calendar.startdate}</td>
                <td>{calendar.enddate}</td>
                <td>{calendar.serviceid}</td>
                <td>{calendar.monday}</td>
                <td>{calendar.tuesday}</td>
                <td>{calendar.wednesday}</td>
                <td>{calendar.thursday}</td>
                <td>{calendar.friday}</td>
                <td>{calendar.saturday}</td>
                <td>{calendar.sunday}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CalendarTwo;
