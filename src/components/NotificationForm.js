import React, { useState } from "react";
import { Button, Modal, Form, Col, Container, Row } from "react-bootstrap";

const NotificationForm = () => {
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDes, setNotificationDes] = useState("");
    const [notificationImage, setNotificationImage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setNotificationDes("");
        setNotificationTitle("");
        setNotificationImage("");
    };

    const handleSendNotification = () => {
        console.log('navigator.serviceWorker.controller:', navigator.serviceWorker.controller);
        console.log('notificationTitle:', notificationTitle);
        console.log('notificationDes:', notificationDes);
        console.log('notificationImage:', notificationImage);
    
        navigator.serviceWorker.controller.postMessage({
            type: 'send_notification',
            data: {
                title: notificationTitle,
                body: notificationDes,
                image: notificationImage
            }
        });
        handleCloseModal();
    };
    
    

    return (
        <>
            <Button onClick={handleShowModal}>Send Notification</Button>
            <Modal
                show={showModal}
                size="lg"
                centered
                onHide={handleCloseModal}
                large
                backdrop="static"
                className="editinfo_modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row className="gap-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Enter Notification Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={notificationTitle}
                                        onChange={(e) => setNotificationTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Enter Notification Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={notificationDes}
                                        onChange={(e) => setNotificationDes(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Paste Image URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={notificationImage}
                                        onChange={(e) => setNotificationImage(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendNotification}>
                        Send Notification
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NotificationForm;
