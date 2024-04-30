import React, { useState} from "react";
import { storage, db } from "../../firebase/Config";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { collection, addDoc } from "@firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "antd";

const videoMetadataCollectionRef = collection(db, "visitorvideo");
const UserRole = () => {
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [channelName, setChannelName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      setErrorMessage("Please select a video to upload.");
      return;
    }

    try {
      // Create parent folder 'visitors profile'
      const visitorsProfileRef = ref(storage, "visitors profile");

      // Create subfolder 'visitors_profile_video'
      const visitorsProfileVideoRef = ref(
        visitorsProfileRef,
        "visitors_profile_video"
      );

      // Create subfolder 'images'
      const imagesRef = ref(visitorsProfileVideoRef, "images");

      // Create subfolder 'videos'
      const videosRef = ref(visitorsProfileVideoRef, "videos");

      // Upload video
      const videoStorageRef = ref(videosRef, video.name);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, video);

      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setErrorMessage("Error uploading video: " + error.message);
          toast.error("Uploading video failed");
        },
        async () => {
          const videoDownloadURL = await getDownloadURL(
            videoUploadTask.snapshot.ref
          );
          toast.success("Successfully uploaded video");
          console.log("Video uploaded successfully. URL:", videoDownloadURL);

          // Upload profile image
          let profileImageDownloadURL = null;
          if (profileImage) {
            const imageStorageRef = ref(imagesRef, profileImage.name);
            const imageUploadTask = uploadBytesResumable(
              imageStorageRef,
              profileImage
            );

            await imageUploadTask;

            profileImageDownloadURL = await getDownloadURL(
              imageUploadTask.snapshot.ref
            );
            console.log(
              "Profile image uploaded successfully. URL:",
              profileImageDownloadURL
            );
          }

          // Store video metadata in Firestore
          const metadata = {
            videoURL: videoDownloadURL,
            imageURL: profileImageDownloadURL,
            description: videoDescription,
            channelName: channelName,
            timestamp: new Date().toISOString(),
          };

          try {
            await addDoc(videoMetadataCollectionRef, metadata);
            console.log("Video metadata stored successfully in Firestore");
            toast.success("Video metadata stored successfully");
          } catch (error) {
            setErrorMessage("Error storing video metadata: " + error.message);
            toast.error("Storing video metadata failed");
          }
          setUploadSuccess(true);
          setUploadProgress(0);
          setVideo(null); // Reset video state
          setVideoDescription(""); // Reset video description state
          setProfileImage(null); // Reset profile image state
          setChannelName(""); // Reset channel name state
        }
      );
    } catch (error) {
      setErrorMessage("Error uploading video: " + error.message);
      toast.error("Uploading video failed");
    }
  };

  return (
    <main>
      <Container className="container-fluid px-3 pt-4">
        <div className="text-center  ">
          <h2 className="text-uppercase p-2 page-title">
            Manage User Roles
          </h2>
        </div>
        {/* <Form>
          <Row className="px-5">
            <Col  className="mt-4 w-100">
           
              <Form.Group className="mb-3">
                <Form.Label htmlFor="video" className="form-label">
                  Select Video:
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  id="video"
                  className="form-control"
                  onChange={handleVideoChange}
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
                  onChange={handleProfileImageChange}
                />
              </Form.Group>
             
              <Form.Group className="mb-3">
                <Form.Label htmlFor="videoDescription" className="form-label">
                  Video Description:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="videoDescription"
                  className="form-control"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
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
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </Form.Group>
              
              <Button
                className="btn btn-primary"
                type="submit"
                onClick={handleUpload}
              >
                Upload
              </Button>
             
              {uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
              )}
            
              {uploadSuccess && <p>Upload successful!</p>}
           
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </Col>
          </Row>
        </Form> */}
      </Container>
      <ToastContainer />
    </main>
  );
};

export default UserRole;
