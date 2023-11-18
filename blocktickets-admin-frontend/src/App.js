import React, { lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/globals.css";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route
            path="/login"
            render={() => {
              if (sessionStorage.getItem("token")) {
                return <Redirect to="/app" />;
              } else {
                return <Login />;
              }
            }}
          />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/user/reset-password" component={ResetPassword} />

          {/* Place new routes over this */}
          <Route
            path="/app"
            render={() => {
              if (sessionStorage.getItem("token")) {
                return <Layout />;
              } else {
                return <Redirect to={"/login"} />;
              }
            }}
          />

          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
