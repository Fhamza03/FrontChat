import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/verifyEmail?token=${token}`
        );

        if (response.ok) {
          setMessage("Votre email a été vérifié avec succès! Vous pouvez maintenant vous connecter.");
          setTimeout(() => navigate("/"), 3000);
        } else {
          const result = await response.text();
          setMessage(result || "Échec de la vérification de l'email.");
        }
      } catch (error) {
        setMessage("Erreur réseau lors de la vérification de l'email.");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("Token de vérification manquant.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Vérification de l'email</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EmailVerification;
