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
    let gtfsData = [];
    
    // Read the GTFS file content
    const fileContent = await file.text();
    
    // Split the file content into lines
    const lines = fileContent.split('\n');
    
    // Process each line of the GTFS file
    lines.forEach((line) => {
      // Split the line into fields (assuming CSV format)
      const fields = line.split(',');
    
      // Extract information for each field
      fields.forEach((value, index) => {
        // Skip the first field which is often an identifier
        if (index !== 0) {
          gtfsData.push({ fieldIndex: index, value });
        }
      });
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
  
      // Add file fields to Firestore collection
      const firestoreCollectionRef = collection(db, 'gtfs_files');
      
      // Upload each field as a separate document
      gtfsData.forEach(async (field) => {
        await addDoc(firestoreCollectionRef, field);
      });
  
      setFile(null);
      toast.success("File uploaded successfully");
      console.log("File uploaded successfully");
  
    } catch (error) {
      toast.error("Error while uploading file");
      console.log("Error while file uploading", error.message, " ", error.code);
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
  )
}