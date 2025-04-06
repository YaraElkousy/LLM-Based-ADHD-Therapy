import React from "react";
import { AuthProvider } from "../app/auth/authContext";
import AppNavigator from "./appNav"; 

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
