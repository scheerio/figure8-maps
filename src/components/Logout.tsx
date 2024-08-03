// Logout.tsx

import React from "react";
// import { signOut } from "firebase/auth"; // Import signOut from firebase/auth

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
      Logout
    </button>
  );
};

export default Logout;
