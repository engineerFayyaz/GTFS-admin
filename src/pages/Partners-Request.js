import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { Col, Container, Row, Modal, Form, Button, Table } from "react-bootstrap";

function PartnersRequest() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const db = getFirestore();
      const partnersRef = collection(db, "PartnersInfo");
      const partnersSnapshot = await getDocs(partnersRef);
      const partnersList = partnersSnapshot.docs.map(doc => doc.data());
      setPartners(partnersList);
    };

    fetchPartners();
  }, []);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filename'; // You can set a default filename here
    link.target = '_blank'; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <Container>
       <div className="text-center  mt-3">
        <h2 className="text-uppercase p-2 page-title">Partners Information</h2>
        </div>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Company_Name</th>
                <th>Contact_Person</th>
                <th>Email</th>
                <th>GTFS_Files</th>
                <th>Phone</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <tr key={index}>
                  <td>{partner.companyName}</td>
                  <td>{partner.contactPerson}</td>
                  <td>{partner.email}</td>
                  <td>
                    {partner.gtfsFiles && (
                      <Button
                        variant="primary"
                        onClick={() => handleDownload(partner.gtfsFiles)}
                      >
                        Download
                      </Button>
                    )}
                  </td>
                  <td>{partner.phone}</td>
                  <td>{partner.website}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default PartnersRequest;
