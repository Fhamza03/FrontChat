import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      // Call the backend to verify the email with the token
      verifyEmail(token);
    } else {
      setVerificationStatus("Invalid token.");
      setLoading(false);
    }
  }, [location.search]);

  const verifyEmail = async (token) => {
    try {
      // Adjust the URL dynamically based on your ngrok or backend URL
      const ngrokUrl = "https://3fd8-105-67-134-33.ngrok-free.app"; // Change this to dynamic URL if needed
      const response = await fetch(`${ngrokUrl}/verify?token=${token}`, {
        method: "GET",
      });

      if (response.ok) {
        setVerificationStatus("Email verified successfully!");
      } else {
        const errorMessage = await response.text();
        if (response.status === 400) {
          setVerificationStatus("Invalid or expired verification token.");
        } else {
          setVerificationStatus(
            errorMessage || "Failed to verify email. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setVerificationStatus("Error occurred while verifying the email.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    // Redirect the user to the login page or another page after verification
    navigate("/login");
  };

  return (
    <div className="verification-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Email Verification</h2>
          <p>{verificationStatus}</p>
          {verificationStatus === "Email verified successfully!" && (
            <button onClick={handleRedirect}>Go to Login</button>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
