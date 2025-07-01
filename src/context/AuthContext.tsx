import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { OpenAPI } from "../api/generated/core/OpenAPI"; // Импортируем OpenAPI

// Типы для контекста
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Создаем контекст с дефолтным значением
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );

  // При смене токена обновляем localStorage и OpenAPI.TOKEN
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      OpenAPI.TOKEN = token; // Обновляем токен в OpenAPI
    } else {
      localStorage.removeItem("auth_token");
      OpenAPI.TOKEN = ""; // Очищаем токен в OpenAPI
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    OpenAPI.TOKEN = ""; // Очистить токен в OpenAPI при выходе
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//  использование контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
