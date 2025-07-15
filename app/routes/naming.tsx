import { Outlet } from "@remix-run/react";

export default function NamingLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            사주 작명 서비스
          </h1>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}