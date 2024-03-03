import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./Component/Misc/error-page";
import { ROUTE } from "./Helper/contant";
import { ThemeProvider, createTheme } from "@mui/material";
import store from "./Store/store";
import { Provider } from "react-redux";
import Users from "./Component/Pages/Users/index.users";
import Customers from "./Component/Pages/Customers/index.customers";
import Designs from "./Component/Pages/Designs/index.designs";
import Orders from "./Component/Pages/Orders/index.orders";
import Login from "./Component/Pages/Login/index.login";
import { Bounce, ToastContainer } from "react-toastify";
import ResetPassword from "./Component/Pages/Reset-Password/index.reset-password";
import { DialogWrapper } from "./Component/Misc/Dialog/index.dialog";

import "react-toastify/dist/ReactToastify.css";

const W = (children) => (
  <>
    {children} <DialogWrapper />
  </>
);

const router = createBrowserRouter([
  {
    path: ROUTE.ROOT.route,
    element: W(<App />),
    errorElement: W(<ErrorPage />),
    children: [
      {
        path: ROUTE.USER.route,
        element: <Users />,
      },
      {
        path: ROUTE.CUSTOMER.route,
        element: <Customers />,
      },
      {
        path: ROUTE.DESIGN.route,
        element: <Designs />,
      },
      {
        path: ROUTE.ORDER.route,
        element: <Orders />,
      },
    ],
  },
  { path: ROUTE.LOGIN.route, element: W(<Login />) },
  {
    path: `${ROUTE.RESET_PASSWORD.route}/:token`,
    element: W(<ResetPassword />),
  },
]);

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        limit={3}
        draggable
        theme="colored"
        transition={Bounce}
        closeOnClick
        autoClose={3000}
      />
    </Provider>
  </ThemeProvider>
);
