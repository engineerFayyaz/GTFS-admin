import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Container, Row, Modal, Form, Button, Table } from "react-bootstrap";

function ContactRequest() {
  const [contactRequests, setContactRequests] = useState([]);

  useEffect(() => {
    const fetchContactRequests = async () => {
      const db = getFirestore();
      const contactRequestsRef = collection(db, "ContactInfo");
      const contactRequestsSnapshot = await getDocs(contactRequestsRef);
      const contactRequestsList = contactRequestsSnapshot.docs.map(doc => doc.data());
      setContactRequests(contactRequestsList);
    };

    fetchContactRequests();
  }, []);

  return (
    <Container>
       <div className="text-center  mt-3">
        <h2 className="text-uppercase p-2 page-title">Contact Requests</h2>
        </div>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>First_Name</th>
                <th>Last_Name</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {contactRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.email}</td>
                  <td>{request.firstname}</td>
                  <td>{request.lastname}</td>
                  <td>{request.message}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactRequest;
