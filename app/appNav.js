import React from "react";
import { useAuth } from "./auth/authContext";
import GuestHome from "./pages/guestHome";
import Home from "./pages/home";

const AppNavigator = () => {
  const { authenticated } = useAuth();

  //console.log(authenticated)
  return authenticated ? <Home /> : <GuestHome />;
};

export default AppNavigator;
