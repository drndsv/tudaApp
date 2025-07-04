import { useEffect, useState } from "react";
import { AppUserResponseDTO, UserControllerService } from "../api/generated";
import { useAuth } from "../context/AuthContext";

export function useFullUser() {
  const { user } = useAuth();
  const [fullUser, setFullUser] = useState<AppUserResponseDTO | null>(null);

  useEffect(() => {
    if (user?.id) {
      UserControllerService.getUser(user.id)
        .then((res) => {
          if (!res.error && res.result) {
            setFullUser(res.result);
          } else {
            console.error("Ошибка получения пользователя:", res.errorMassage);
          }
        })
        .catch((err) => {
          console.error("Ошибка при получении данных пользователя:", err);
        });
    }
  }, [user?.id]);

  return fullUser;
}
