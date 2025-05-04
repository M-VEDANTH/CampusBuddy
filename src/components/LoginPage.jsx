import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    console.log("Google login successful:", response);
    localStorage.setItem("token", response.credential); // Updated to store the correct credential
    navigate("/chat");
  };

  const handleLoginFailure = () => {
    console.error("Google login failed.");
    alert("Google Login Failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to CampusBuddy</h1>
        <p>Your Campus Mentoring Companion</p>
        <GoogleOAuthProvider clientId="768833159976-0kha36jj40jj2igsm557g313i1k3q273.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default LoginPage;