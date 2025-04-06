import React from "react";
import { useAuth } from "./auth/authContext";
import GuestHome from "./pages/guestHome";
import AuthenticatedHome from "./pages/home";

const AppNavigator = () => {
  const { token } = useAuth();

  return token ? <AuthenticatedHome /> : <GuestHome />;
};

export default AppNavigator;
