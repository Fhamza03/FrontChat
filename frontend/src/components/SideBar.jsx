import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChatHub from "../assets/ChatHub.png";

const SideBar = () => {
  const [showGroups, setShowGroups] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  const toggleGroups = () => setShowGroups(!showGroups);
  const toggleFriends = () => setShowFriends(!showFriends);

  return (
    <aside className="w-64 bg-[#F9F7F7] text-white flex flex-col">
      <img src={ChatHub} alt="Logo" className="mx-auto w-24 h-auto mb-4 mt-4" />
      <nav className="flex-grow p-4 space-y-4">
        <ul className="space-y-4">
          {/* Chat */}
          <li>
            <Link
              to="/chats"
              className="text-black flex items-center p-2 rounded hover:bg-gray-700  "
            >
              <svg
                className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z"
                  clipRule="evenodd"
                />
              </svg>
              Chats
            </Link>
          </li>

          {/* Groups */}
          <li>
            <div
              onClick={toggleGroups}
              className="text-black flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                  clipRule="evenodd"
                />
              </svg>
              Groups
              <svg
                className="w-6 h-6 text-black dark:text-white ml-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m8 10 4 4 4-4"
                />
              </svg>
            </div>
            {showGroups && (
              <ul className="pl-6 space-y-2 mt-2">
                <li>
                  <Link
                    to="/groups"
                    className="text-black flex items-center p-2 rounded hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Groups List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-group"
                    className="text-black flex items-center p-2 rounded hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Group
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Friends */}
          <li>
            <div
              onClick={toggleFriends}
              className="text-black flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM7 12.5a.5.5 0 0 1 .495.43.762.762 0 0 0 .157.096c.213.106.553.208 1.005.295.896.173 2.111.262 3.343.262 1.232 0 2.447-.09 3.343-.262.452-.087.792-.19 1.006-.295a.764.764 0 0 0 .156-.096.5.5 0 0 1 .995.07c0 1.19-.644 2.438-1.618 3.375C14.9 17.319 13.531 18 12 18c-1.531 0-2.9-.681-3.882-1.625C7.144 15.438 6.5 14.19 6.5 13a.5.5 0 0 1 .5-.5Zm9.519.417.003-.004-.003.004Zm-9.038 0a.017.017 0 0 1-.003-.004l.003.004Zm.901-4.853L9 6.81l.619 1.253 1.381.2-1 .976.236 1.376-1.237-.65-1.235.65L8 9.239l-1-.975 1.382-.2Zm6 0L15 6.81l.619 1.253 1.381.2-1 .976.236 1.376-1.237-.65-1.235.65L14 9.239l-1-.975 1.382-.2Z"
                  clipRule="evenodd"
                />
              </svg>
              Friends
              <svg
                className="w-6 h-6 text-black dark:text-white ml-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m8 10 4 4 4-4"
                />
              </svg>
            </div>
            {showFriends && (
              <ul className="pl-6 space-y-2 mt-2">
                <li>
                  <Link
                    to="/friends"
                    className="text-black flex items-center p-2 rounded hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Friends List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search-friends"
                    className="text-black flex items-center p-2 rounded hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
                      <path
                        fillRule="evenodd"
                        d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Search Friends
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Notifications */}
          <li>
            <Link
              to="/notifications"
              className="text-black flex items-center p-2 rounded hover:bg-[gray-700]"
            >
              <svg
                className="w-6 h-6 text-[#3F72AF] dark:text-white mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
              </svg>
              Notifications
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
