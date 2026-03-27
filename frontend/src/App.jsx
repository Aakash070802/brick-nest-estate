import { useRoutes } from "react-router";
import { routes } from "./routes/routesConfig";
import Header from "./components/Header";

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <Header />
      {routing}
    </>
  );
}

export default App;
