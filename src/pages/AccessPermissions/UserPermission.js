import React, { useState} from "react";
import { storage, db } from "../../Config.js";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { collection, addDoc } from "@firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "antd";

const visitorMetadataCollectionRef = collection(db, "visitorgallery");

const UserPermission = () => {
  const [galleryImage, setGalleryImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [thumbnails, setThumbnails] = useState(Array(3).fill(null));
  const [profileName, setProfileName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [cityName, setCityName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGalleryImageChange = (e) => {
    if (e.target.files[0]) {
      setGalleryImage(e.target.files[0]);
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e, index) => {
    if (e.target.files[0]) {
      const newThumbnails = [...thumbnails];
      newThumbnails[index] = e.target.files[0];
      setThumbnails(newThumbnails);
    }
  };

  const handleUpload = async () => {
    if (!galleryImage || !profileImage || thumbnails.some(thumbnail => !thumbnail) || !profileName || !countryName || !cityName) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      const metadata = {
        profileName,
        countryName,
        cityName,
        timestamp: new Date().toISOString(),
      };

      const visitorProfileRef = ref(storage, "visitors profile");
      const visitorsGalleryRef = ref(visitorProfileRef, "visitors_gallery");
      const profileImagesRef = ref(visitorsGalleryRef, "profile_images");
      const galleryImagesRef = ref(visitorsGalleryRef, "gallery_images");
      const thumbnailsRef = ref(visitorsGalleryRef, "thumbnails_images");

      // Upload gallery image
      const galleryStorageRef = ref(galleryImagesRef, galleryImage.name);
      await uploadBytesResumable(galleryStorageRef, galleryImage);
      metadata.galleryImageURL = await getDownloadURL(galleryStorageRef);

      // Upload profile image
      const profileStorageRef = ref(profileImagesRef, profileImage.name);
      await uploadBytesResumable(profileStorageRef, profileImage);
      metadata.profileImageURL = await getDownloadURL(profileStorageRef);

      // Upload thumbnails
      const thumbnailURLs = [];
      for (let i = 0; i < 3; i++) {
        const thumbnailRef = ref(thumbnailsRef, `${profileName}_${i + 1}_${thumbnails[i].name}`);
        await uploadBytesResumable(thumbnailRef, thumbnails[i]);
        thumbnailURLs.push(await getDownloadURL(thumbnailRef));
      }
      metadata.thumbnailURLs = thumbnailURLs;

      await addDoc(visitorMetadataCollectionRef, metadata);
      toast.success("Visitor metadata stored successfully");

      setUploadSuccess(true);
      setUploadProgress(0);
      setGalleryImage(null);
      setProfileImage(null);
      setThumbnails(Array(3).fill(null));
      setProfileName("");
      setCountryName("");
      setCityName("");
    } catch (error) {
      setErrorMessage("Error uploading visitor data: " + error.message);
      toast.error("Uploading visitor data failed");
    }
  };

  return (
    <main>
      <Container className="container-fluid px-3 py-4 ">
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Access User Permission</h2>
        </div>
      </Container>
      <ToastContainer />
    </main>
  );
};

export default UserPermission;
