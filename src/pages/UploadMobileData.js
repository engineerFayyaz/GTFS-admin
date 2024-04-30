import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "antd";
import { ToastContainer, toast } from "react-toastify";
const UploadMobileData = (e) => {
  return (
    <main>
      <Container className="container-fluid px-3 pt-4">
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">
            Upload Data For Mobile App
          </h2>
        </div>
        <div className="text-center">
          <a href="https://gtfs.middmobiles.com/" className="p-2" target="_blank">
            <Button className="btn btn-primary w-50 mb-3 " type="submit" height={"45px"} style={{border:"none", height:"45px"}} >
              Upload
            </Button>
          </a>
        </div>
        {/* <Form>
          <Row className="px-5">
            <Col className="mt-4 w-100">
            
              <Form.Group className="mb-3">
                <Form.Label htmlFor="video" className="form-label">
                  Select Video:
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  id="video"
                  className="form-control"
                />
              </Form.Group>
             
              <Form.Group className="mb-3">
                <Form.Label htmlFor="profileImage" className="form-label">
                  Select Profile Image:
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  className="form-control"
                />
              </Form.Group>
             
              <Form.Group className="mb-3">
                <Form.Label htmlFor="channelName" className="form-label">
                  Video Title::
                </Form.Label>
                <Form.Control id="videoTitle" className="form-control" />
              </Form.Group>
            
              <Form.Group className="mb-3">
                <Form.Label htmlFor="videoDescription" className="form-label">
                  Video Description:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="videoDescription"
                  className="form-control"
                />
              </Form.Group>
            
              <Form.Group className="mb-3">
                <Form.Label htmlFor="channelName" className="form-label">
                  Channel Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="channelName"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group>
                <Button
                  className="btn btn-primary"
                  type="submit"
                 
                >
                  Upload
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form> */}
      </Container>
      <ToastContainer />
    </main>
  );
};

export default UploadMobileData;
