import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routesConfig";
import { useSelector } from "react-redux";
import GlobalLoader from "./components/common/GlobalLoader";

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
  const globalLoading = useSelector((state) => state.user.globalLoading);

  return (
    <div className="relative">
      {globalLoading && <GlobalLoader />}

      <Routes>{renderRoutes(routes)}</Routes>
    </div>
  );
}

export default App;
