
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RequireAuth from './components/RequireAuth';
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { AuthProvider } from './context/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />} />

      <Route element={<RequireAuth />}>
      <Route path="/admin/*" element={<AdminLayout />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth/*" replace />} />
    </Routes>
  </BrowserRouter>
  </AuthProvider>
  
);
