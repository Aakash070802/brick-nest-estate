import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routesConfig";

const renderRoutes = (routesArray) => {
  return routesArray.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return <Route key={index} path={route.path} element={route.element} />;
  });
};

function App() {
  return <Routes>{renderRoutes(routes)}</Routes>;
}

export default App;
