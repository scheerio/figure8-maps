// Login.tsx

import React from "react";
import { handleGoogleSignIn } from "../util/handleGoogleSignIn";

const Login: React.FC = () => {
  return (
    <button
      onClick={handleGoogleSignIn}
      className="text-white hover:underline cursor-pointer"
    >
      Sign in with Google
    </button>
  );
};

export default Login;
