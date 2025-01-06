import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate(); // Initialize the navigation hook

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const url = isSignIn
      ? "http://127.0.0.1:8000/auth/login/"
      : "http://127.0.0.1:8000/auth/register/";

    try {
      const response = await axios.post(url, formData);
      alert(`Success: ${response.data.token}`);
      localStorage.setItem("token", response.data.token);

      // Navigate to Dashboard page after successful login or registration
      navigate("/dashboard");
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <body className="body">
      <div className="page-container">
        <div className="container">
          {/* Sign Up Form */}
          <div className={`form-box left ${isSignIn ? "inactive-form" : ""}`}>
            <h2>Create Account</h2>
            <div className="social-buttons">
              <button>Google</button>
            </div>
            <p>or use your email for registration</p>
            <input
              type="text"
              name="username"
              placeholder="Name"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <button className="submit-btn" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          <div className={`form-box right ${isSignIn ? "" : "inactive-form"}`}>
            <h2>Sign In</h2>
            <div className="social-buttons">
              <button>Google</button>
            </div>
            <p>or use your email and password</p>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <button className="submit-btn" onClick={handleSubmit}>
              Sign In
            </button>
          </div>

          {/* Overlay */}
          <div className={`overlay ${isSignIn ? "overlay-left" : "overlay-right"}`}>
            <div className="overlay-content">
              {isSignIn ? (
                <>
                  <h2>Hello, Friend!</h2>
                  <p>Register with your personal details to start your journey with us.</p>
                  <button className="toggle-btn" onClick={toggleMode}>
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <h2>Welcome Back!</h2>
                  <p>Sign in to access your account and continue using our services.</p>
                  <button className="toggle-btn" onClick={toggleMode}>
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default LoginPage;
