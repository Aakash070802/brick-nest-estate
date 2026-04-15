import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
