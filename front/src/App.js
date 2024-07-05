import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Root from "./components/Root";
import ErrorPage from "./components/error-page";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Suivi from "./components/Suivi";
import AddDatePage from "./components/AddDatePage";
import Calendar from "./components/Calendar";
import Authentification from "./components/Authentification";
import "../src/styles/styles.css";
import Booker from "./components/Booker";
import Admin from "./components/Admin";
import Checklist from "./components/Checklist";
import Compta from "./components/Compta";
import { Home } from "./components/Home";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="suivi" element={<Home />} />
          <Route path="add_date" element={<AddDatePage />} />
          <Route path="calendrier" element={<Calendar />} />
          <Route path="sign_in" element={<Authentification />} />
          <Route path="mes_bookings" element={<Booker />} />
          <Route path="admin" element={<Admin />} />
          <Route path="checklist" element={<Checklist />} />
          <Route path="compta" element={<Compta />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </>,
    ])
  );

  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
  });

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
