import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { OpenAPI } from "../api/generated/core/OpenAPI";
import { AuthControllerService } from "../api/generated";

// Тип декодированных данных из токена
interface DecodedUser {
  sub: string;
  roles?: string[];
  id?: number;
  exp?: number;
  [key: string]: any;
}

// Типы контекста
interface AuthContextType {
  token: string | null;
  user: DecodedUser | null;
  login: (accessToken: string, refreshToken: string) => void;
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

  // Обновить access-токен через refresh
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await AuthControllerService.getNewRefreshToken({
        refreshToken,
      });
      if (res.accessToken && res.refreshToken) {
        login(res.accessToken, res.refreshToken);
        setTimeout(() => {
          console.log("[REFRESH] Перезагрузка страницы...");
          window.location.reload();
        }, 200);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Ошибка обновления токена:", err);
      logout();
    }
  };

  // Проверка срока действия токена
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) return;

      try {
        const decoded = jwtDecode<DecodedUser>(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          refreshAccessToken();
        }
      } catch (e) {
        logout();
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 30_000); // каждые 30 сек
    return () => clearInterval(interval);
  }, [token]);

  // При изменении токена
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      OpenAPI.TOKEN = token;
      try {
        const decoded = jwtDecode<DecodedUser>(token);
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

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
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
