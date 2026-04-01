import { useRoutes } from "react-router";
import { routes } from "./routes/routesConfig";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <Header />
      {routing}
      <div className="bg-bg text-text min-h-screen p-10">
        <ThemeToggle />

        <div className="bg-card p-6 rounded-xl shadow-card mt-6">
          <h1 className="text-2xl font-bold">BrickNest</h1>
          <p className="text-muted">Theme working</p>
        </div>
      </div>
    </>
  );
}

export default App;
