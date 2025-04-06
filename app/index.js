import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./AppNavigator"; // You’ll create this

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
