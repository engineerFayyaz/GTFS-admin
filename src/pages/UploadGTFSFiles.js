import React,{useState} from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {toast, ToastContainer} from "react-toastify"
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
    const lines = fileContent.split('\n');
  
    // Process each line of the GTFS file
    lines.forEach((line) => {
      // Split the line into fields (assuming CSV format)
      const fields = line.split(',');
  
      // Example: Extract route information
      if (fields[0] === 'route_id') {
        const routeId = fields[0];
        const routeShortName = fields[1];
        const routeLongName = fields[2];
        // Store route information in Firestore
        gtfsData.routes = gtfsData.routes || [];
        gtfsData.routes.push({ routeId, routeShortName, routeLongName });
      }
  
      // Example: Extract stop information
      if (fields[0] === 'stop_id') {
        const stopId = fields[0];
        const stopName = fields[1];
        const stopLat = fields[2];
        const stopLon = fields[3];
        // Store stop information in Firestore
        gtfsData.stops = gtfsData.stops || [];
        gtfsData.stops.push({ stopId, stopName, stopLat, stopLon });
      }
  
      // Add more logic to extract other data types (e.g., trips, schedules) as needed
    });
  
    return gtfsData;
  };

  // const parseGTFSFile = async (file) => {
  //   let gtfsData = {};

  //   const fileContent = await file.text(); 
  //   const lines = fileContent.split("\n"); 

  //   lines.forEach((line) => {
  //     const fields = line.split(","); 

  //     if (fields[0] === "count") {
  //       gtfsData.count = parseInt(fields[1], 10);
  //     }

  //     if (fields[0] === "enddate" || fields[0] === "startdate") {
  //       gtfsData[fields[0]] = fields[1];
  //     }

  //     if (["friday", "monday", "saturday", "sunday", "thursday", "tuesday", "wednesday"].includes(fields[0])) {
  //       gtfsData[fields[0]] = fields[1];
  //     }

  //     if (fields[0] === "serviceid") {
  //       gtfsData.serviceid = fields.slice(1).join(",");
  //     }
      
  //   });

  //   return gtfsData;
  // };

  const handleSubmit = async (e) => {

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const docRef = ref(storage, `gtfs/${file.name}`)

    try {

     await uploadBytes(docRef,file);
      const gtfsData = await parseGTFSFile(file);

     const downloadUrl = await getDownloadURL(docRef);
     setFile(null);
     toast.success("file uploaded successfully");
     console.log("file uploaded successfully");

    // Add file data to Firestore collection
    const firestoreCollectionRef = collection(db, 'gtfs_files');
    await addDoc(firestoreCollectionRef, gtfsData);
    console.log("file added successfully in firestore collection ", firestoreCollectionRef);
    } catch (error) {
      toast.error("error while uploading file");
      console.log("error while file uploading", error.message, " ", error.code);
      
    }
  }
  return (
    <>
    <ToastContainer />
    <div>
      
      <input type="file" onChange={handleFileChange} accept=".txt" />
      <button onClick={handleSubmit}>Upload</button>
    </div>
    </>
  )
}