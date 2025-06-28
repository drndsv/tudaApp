import { useState } from "react";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    login: "ivanov",
    password: "●●●●●●●",
    surname: "Иванов",
    name: "Иван",
    patronymic: "Иванович",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancel = () => {
    setFormData({
      login: "ivanov",
      password: "●●●●●●●",
      surname: "Иванов",
      name: "Иван",
      patronymic: "Иванович",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Тут будет запрос на бэкенд
    setIsEditing(false);
  };

  return (
    <div className="bg-cream min-h-screen text-dark">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center mb-10">Ваши данные</h1>

        <div className="bg-white shadow-md rounded-xl p-6">
          {/* Идентификационные данные */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Идентификационные данные</h2>
            {!isEditing && (
              <PrimaryButton onClick={() => setIsEditing(true)}>
                Редактировать
              </PrimaryButton>
            )}
          </div>

          <div className="space-y-2 mb-6">
            {["login", "password"].map((field) => (
              <div
                key={field}
                className="p-3 rounded-xl shadow-sm border border-b-gray-500 flex items-center gap-6"
              >
                <span className="font-medium w-32">
                  {field === "login" ? "Логин" : "Пароль"}
                </span>
                {isEditing ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    className="bg-cream px-2 py-1 rounded-md text-sm w-full"
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <span className="text-sm text-gray-700">
                    {formData[field as keyof typeof formData]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Личные данные */}
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">Личные данные</h2>
          </div>
          <div className="space-y-2">
            {["surname", "name", "patronymic"].map((field, idx) => (
              <div
                key={field}
                className="p-3 rounded-xl shadow-sm border border-b-gray-500 flex items-center gap-6"
              >
                <span className="font-medium w-32">
                  {["Фамилия", "Имя", "Отчество"][idx]}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    className="bg-cream px-2 py-1 rounded-md text-sm w-full"
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <span className="text-sm text-gray-700">
                    {formData[field as keyof typeof formData]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Кнопки "Сохранить" и "Отмена" */}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <PrimaryButton onClick={handleCancel}>Отмена</PrimaryButton>
              <PrimaryButton onClick={handleSave}>Сохранить</PrimaryButton>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
