import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routesConfig";

function App() {
  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.children) {
          return (
            <Route key={index} element={route.element}>
              {route.children.map((child, i) => (
                <Route key={i} path={child.path} element={child.element} />
              ))}
            </Route>
          );
        }

        return <Route key={index} path={route.path} element={route.element} />;
      })}
    </Routes>
  );
}

export default App;
