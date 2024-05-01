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
function Shapes2() {
  const [Shapes, setShapes] = useState([]);

  useEffect(() => {
    const getShapes = async () => {
      try {
        const ShapesData = collection(db, "shapes2");
        const querySnapshot = await getDocs(ShapesData);

        const fetchedData = [];

        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        //
        setShapes(fetchedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getShapes();
  }, []);

  const handleEdit = (index) => {
    // Implement edit functionality here
    const user = Shapes[index];
    // Example: Redirect to edit page or open a modal with user data
    console.log("Edit user:", user);
  };

  const handleDelete = async (index) => {
    // Implement delete functionality here
    const user = Shapes[index];
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "RegisteredUsers", user.id));
      // Remove the user from the state
      setShapes((prevUsers) => prevUsers.filter((_, i) => i !== index));
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
            <h5 className="text-uppercase p-2 page-title">Shapes_2 Data</h5>
          </div>
        </div>
        <Table striped bordered hover className=" overflow-scroll  ">
          <thead>
            <tr>
              <th>Count</th>
              <th>Shape Id</th>
              <th>Shape_pt_lat</th>
              <th>Shape_pt_lon</th>
              <th>Shape_pt_sequence</th>
            </tr>
          </thead>
          <tbody>
            {Shapes.map((shapes) => (
              <tr key={shapes.id}>
                <td className="text-secondary">
                  <b>{shapes.count}</b>
                </td>
                <td>{shapes.shape_id}</td>
                <td>{shapes.shape_pt_lat}</td>
                <td>{shapes.shape_pt_lon}</td>
                <td>{shapes.shape_pt_sequence} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Shapes2;
