import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatHub from "../assets/ChatHub.png";
import LoginImage from "../assets/LoginImage.jpg";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error
    setSuccessMessage(""); // Reset success

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(
          "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte."
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          userName: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      setErrorMessage("Well done, verify email please before login !!");
    }
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
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={ChatHub}
              alt="Logo"
              className="mx-auto w-40 h-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Créer un compte
            </h1>
            <p className="text-gray-600">
              Remplissez les champs pour vous inscrire
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm text-center">
                {successMessage}
              </p>
            )}
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <input
                type="text"
                name="userName"
                placeholder="Nom d'utilisateur"
                value={formData.userName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 text-white font-semibold py-2 rounded-lg hover:bg-sky-700 transition"
            >
              S'inscrire
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/" className="text-sky-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
