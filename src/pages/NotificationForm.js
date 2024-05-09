// NotificationForm.js

import React, { useState } from "react";
import { sendNotification } from "../Config";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
const NotificationForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send the notification
    await sendNotification(title, body);
    // Clear the form
    setTitle("");
    setBody("");
  };

  return (
    <Container>
      <Row className="d-flex align-items-center justify-content-center p-5">
        <Col xs="8" >
          <div>
            <h2 className="text-center mb-4">Send Notification</h2>
            <Form onSubmit={handleSubmit} >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter Message Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="message title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enter Message Detail</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="message detail"
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Notify Now
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationForm;
