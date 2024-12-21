import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatHub from "../assets/ChatHub.png";
import LoginImage from "../assets/LoginImage.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { userName, password } = formData;

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.userId;

        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("username", userName);

        navigate("/AllChats");
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Section with Image */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-sky-100">
        <img
          className="w-full h-full object-cover rounded-r-lg"
          src={LoginImage}
          alt="Login Illustration"
        />
      </div>

      {/* Right Section with Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full p-6 rounded-lg shadow-xl border border-gray-200">
          {/* Header with Logo and Title */}
          <div className="text-center mb-8">
            <img
              src={ChatHub}
              alt="Logo"
              className="mx-auto w-40 h-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              BIENVENUE DE NOUVEAU !
            </h1>
            <p className="text-gray-600">
              Veuillez entrer vos identifiants ci-dessous
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <div className="space-y-4">
              <input
                type="text"
                name="userName"
                placeholder="Nom d'utilisateur"
                value={formData.userName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <Link
                to="/forgot-password"
                className="text-sky-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 text-white font-semibold py-2 rounded-lg hover:bg-sky-700 transition"
            >
              Se connecter
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Pas de compte ?{" "}
            <Link
              to="/signup"
              className="text-sky-600 hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
