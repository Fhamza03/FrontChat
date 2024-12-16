import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const SearchFriends = () => {
  const [users, setUsers] = useState([]); // Liste complète des utilisateurs
  const [displayedUsers, setDisplayedUsers] = useState([]); // Utilisateurs filtrés
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur

  const senderId = sessionStorage.getItem("userId");

  // Récupérer les utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/AllUsers/${senderId}`);
        if (!response.ok) {
          throw new Error("Échec de la récupération des utilisateurs");
        }
        const data = await response.json();
        setUsers(data);
        setDisplayedUsers(data.slice(0, 4)); // Affiche les 4 premiers utilisateurs
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des utilisateurs :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [senderId]);

  // Gestion de la recherche
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue) {
      const filteredUsers = users.filter(
        (user) =>
          user.username &&
          user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setDisplayedUsers(filteredUsers.slice(0, 4)); // Affiche les 4 premiers résultats filtrés
    } else {
      setDisplayedUsers(users.slice(0, 4)); // Réinitialise les utilisateurs affichés
    }
  };

  // Gestion de l'envoi de demande d'ami
  const handleSendRequest = async (receiverId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/sendRequest/${senderId}/${receiverId}`,
        {
          method: "POST",
        }
      );
  
      if (!response.ok) {
        throw new Error("Échec de l'envoi de la demande d'ami");
      }
  
      console.log(`Demande d'ami envoyée à l'utilisateur avec l'ID : ${receiverId}`);
  
      // Sélectionner le bouton par ID et modifier son texte et son style
      const button = document.getElementById(`sendRequestButton-${receiverId}`);
      
      if (button) {
        button.textContent = "Demande envoyée";
        button.style.backgroundColor = "gray"; // Changer la couleur du bouton en gris
        button.disabled = true; // Désactiver le bouton
      }
  
      // Met à jour le statut d'amitié pour cet utilisateur
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === receiverId
            ? { ...user, friendshipStatus: "PENDING" }
            : user
        )
      );
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de l'envoi de la demande d'ami :", err);
    }
  };
  

  return (
    <div className="h-screen flex bg-[#DBE2EF]">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <Header />
        <div className="p-4">
          <input
            type="text"
            placeholder="Rechercher des amis..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-4 mt-4">
            {loading ? (
              <p>Chargement des utilisateurs...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://icons-for-free.com/iff/png/512/home+page+profile+user+icon-1320184041392976124.png"
                      alt="Avatar"
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-left text-gray-600">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`sendRequestButton-${user.userId}`}
                    onClick={() => handleSendRequest(user.userId)}
                    disabled={user.friendshipStatus === "PENDING" || user.friendshipStatus === "ACCEPTED"}
                    className={`mt-4 text-sm px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-4 transition-all duration-300 transform ${
                      user.friendshipStatus === "PENDING"
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : user.friendshipStatus === "REJECTED"
                        ? "bg-[#3F72AF] text-white hover:bg-[#112D4E] focus:ring-[#3F72AF]"
                        : user.friendshipStatus === "ACCEPTED"
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-[#3F72AF] text-white hover:bg-[#112D4E] focus:ring-[#3F72AF]"
                    }`}
                  >
                    {user.friendshipStatus === "PENDING"
                      ? "Demande envoyée"
                      : user.friendshipStatus === "REJECTED" || user.friendshipStatus === null
                      ? "Envoyer une demande"
                      : user.friendshipStatus === "ACCEPTED"
                      ? "Amis"
                      : "Envoyer une demande"}
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun utilisateur trouvé</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFriends;
