import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { OpenAPI } from "../api/generated/core/OpenAPI";

// Тип декодированных данных из токена
interface DecodedUser {
  sub: string;
  roles?: string[];
  id?: number;
  [key: string]: any; // на случай, если в токене появятся другие поля
}

// Типы контекста
interface AuthContextType {
  token: string | null;
  user: DecodedUser | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [user, setUser] = useState<DecodedUser | null>(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      try {
        return jwtDecode<DecodedUser>(storedToken);
      } catch {
        return null;
      }
    }
    return null;
  });

  // обновляем OpenAPI и user при изменении токена
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      OpenAPI.TOKEN = token;
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        console.log("Декодированный токен:", decoded);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      localStorage.removeItem("auth_token");
      OpenAPI.TOKEN = "";
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    OpenAPI.TOKEN = "";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
