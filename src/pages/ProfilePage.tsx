import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfilePage() {
  return (
    <div className="bg-cream min-h-screen text-dark">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center mb-10">Ваши данные</h1>

        <div className="bg-white shadow-md rounded-xl p-6">
          {/* Идентификационные данные */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Идентификационные данные</h2>
            <PrimaryButton>Редактировать</PrimaryButton>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <span className="block font-medium">Логин</span>
              <span className="text-sm text-gray-700">ivanov</span>
            </div>
            <div>
              <span className="block font-medium">Пароль</span>
              <span className="text-sm text-gray-700">●●●●●●●</span>
            </div>
          </div>

          {/* Личные данные */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold mb-4">Личные данные</h2>
          </div>
          <div className="space-y-4">
            <div>
              <span className="block font-medium">Фамилия</span>
              <span className="text-sm text-gray-700">Иванов</span>
            </div>
            <div>
              <span className="block font-medium">Имя</span>
              <span className="text-sm text-gray-700">Иван</span>
            </div>
            <div>
              <span className="block font-medium">Отчество</span>
              <span className="text-sm text-gray-700">Иванович</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
