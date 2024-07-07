// Logout.tsx

import React from "react";
import { signOut } from "firebase/auth"; // Import signOut from firebase/auth
// import { FaUserCircle } from 'react-icons/fa';

interface LogoutProps {
  signOut: () => Promise<void>;
}

const Logout: React.FC<LogoutProps> = ({ signOut }) => {
  const handleSignOut = async () => {
    try {
      await signOut(); // Use signOut function
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-white hover:underline cursor-pointer"
    >
      {/* <FaUserCircle className="text-2xl mr-2" /> */}
      Logout
    </button>
  );
};

export default Logout;
