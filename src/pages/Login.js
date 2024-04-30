import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../firebase/Config"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {storeUserToLocalStorage} from "../utils/localstorage"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginForm = document.getElementById("login");
    
    // Check if the entered email is the admin's email
    if (email === "adminbusmate@gmail.com") {
      // Check if the entered password matches the default password
      if (password === "admin123") {
        // If the credentials are correct, proceed with login
        toast.success("Welcome admin");
        loginForm.reset();
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        // If the password is incorrect, show an error message
        toast.error("Invalid password");
      }
    } else {
      // If the entered email is not the admin's email, show an error message
      toast.error("Invalid email");
    }
  };
  
  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   const loginForm = document.getElementById("login");
  //   const log = signInWithEmailAndPassword(auth,email, password).then((userCredentails) => {
  //     const user = userCredentails.user;
  //     storeUserToLocalStorage({email: user.email})

  //     if(user.email === "adminbusmate@gmail.com") {
  //       toast.success("Welcome admin");
  //       loginForm.reset();
  //       setTimeout(() => {
  //         navigate("/admin");
  //       }, 1000)
  //     }
  //     else{
  //       toast.error("Invalid credentials");
  //     }
  //   })
  //   .catch((err) => {
  //    const errorMessage = err.message;
  //     console.error("error is ",errorMessage)
  //    toast.error("Invalid Credentials", errorMessage);
  //   })
  // };

  return (
    <>
      <div className="container-fluid admin-login-container d-flex align-items-center justify-content-center m-0">
        <div className="content">
          <div className="text-center">
          <img src="/images/logo.jpg" width={260} alt="Bus Mate Logo" />
          </div>
          <form className="content__form d-flex flex-column gap-3 " id="login" onSubmit={handleLogin}>
            <div className="content__inputs ">
                <input
                  required
                  type="text"
                  placeholder="adminbusmate@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-100 rounded-3 border-1 p-2 my-2"
                />
                
                <input
                  required
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-100 rounded-3 border-1 p-2 my-2"
                />
            </div>
            <button type="submit" className="p-2 rounded-3 text-light">
              Log In
            </button>
          </form>
          <div className="content__or-text text-center my-2">
            <span />
            <span>
              OR
            </span>
            <span />
          </div>
          <div className="content__forgot-buttons text-center">
            <Link >
             Forget Password
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
