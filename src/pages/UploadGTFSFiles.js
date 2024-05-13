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

  const handleSubmit = async (e) => {

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const docRef = ref(storage, `gtfs/${file.name}`)

    try {

     await uploadBytes(docRef,file);

     const downloadUrl = await getDownloadURL(docRef);
     toast.success("file uploaded successfully");
    console.log("file uploaded successfully");

    const fileData = {
      fileName: file.name,
      downloadURL: downloadUrl,
      uploadedAt: new Date().toISOString()
    };

    // Add file data to Firestore collection
    const firestoreCollectionRef = collection(db, 'gtfs_files');
    await addDoc(firestoreCollectionRef, fileData);
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