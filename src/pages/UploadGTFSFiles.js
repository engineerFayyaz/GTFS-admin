import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { collection, addDoc, getFirestore } from "firebase/firestore";
export const UploadGTFSFiles = () => {
  const [file, setFile] = useState(null);
  const storage = getStorage();
  const db = getFirestore();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Example parseGTFSFile function to extract data from GTFS files
  const parseGTFSFile = async (file) => {
    // Placeholder for parsed GTFS data
    let gtfsData = {};

    // Read the GTFS file content
    const fileContent = await file.text();

    // Split the file content into lines
    const lines = fileContent.split("\n");

    // Process each line of the GTFS file
    lines.forEach((line) => {
      // Split the line into fields (assuming CSV format)
      const fields = line.split(",");

      if (fields[0] === "id") {
        gtfsData.id = fields[1];
      }
      if (fields[0] === "serviceid") {
        gtfsData.serviceid = fields[1];
      }
      if (fields[0] === "startdate") {
        gtfsData.startdate = fields[1];
      }
      if (fields[0] === "enddate") {
        gtfsData.enddate = fields[1];
      }
      if (fields[0] === "friday") {
        gtfsData.friday = fields[1];
      }
      if (fields[0] === "monday") {
        gtfsData.monday = fields[1];
      }
      if (fields[0] === "saturday") {
        gtfsData.saturday = fields[1];
      }
      if (fields[0] === "sunday") {
        gtfsData.sunday = fields[1];
      }
      if (fields[0] === "thursday") {
        gtfsData.thursday = fields[1];
      }
      if (fields[0] === "tuesday") {
        gtfsData.tuesday = fields[1];
      }
      if (fields[0] === "wednesday") {
        gtfsData.wednesday = fields[1];
      }
      if (fields[0] === "count") {
        gtfsData.count = fields[1];
      }
    });

    return gtfsData;
  };

  const handleSubmit = async (e) => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const docRef = ref(storage, `gtfs/${file.name}`);

    try {
      await uploadBytes(docRef, file);
      const gtfsData = await parseGTFSFile(file);

      const downloadUrl = await getDownloadURL(docRef);
      setFile(null);
      toast.success("file uploaded successfully");
      console.log("file uploaded successfully");

      // Add file data to Firestore collection
      const firestoreCollectionRef = collection(db, "gtfs_files");
      await addDoc(firestoreCollectionRef, gtfsData);
      console.log(
        "file added successfully in firestore collection ",
        firestoreCollectionRef
      );
    } catch (error) {
      toast.error("error while uploading file");
      console.log("error while file uploading", error.message, " ", error.code);
    }
  };
  return (
    <>
      <ToastContainer />
      <div>
        <input type="file" onChange={handleFileChange} accept=".txt" />
        <button onClick={handleSubmit}>Upload</button>
      </div>
    </>
  );
};
