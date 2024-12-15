import React ,{useState} from "react";

const Header = () => {
  const userLoggedIn = sessionStorage.getItem("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogOut = () => {
    // Implement your logout functionality here
    console.log("Logged out");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-[#3F72AF] text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Welcome back {userLoggedIn}</h1>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2"
          >
            <svg
              className="w-10 h-10 text-gray-800 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <button
                    className="block px-4 py-2 text-sm "
                    onClick={() => console.log("My Profile")}
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
