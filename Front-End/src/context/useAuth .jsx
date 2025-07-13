import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext); // Usa o React.useContext
    if (context === null) {
      // Isso é um erro fatal se useAuth for chamado fora do AuthProvider
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};