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
      <Row>
        <Col>
          <h1>Contact Requests</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
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
