// src/pages/Unauthorized.js
import React from "react";
import { useAuth } from "../../context/AuthProvider";


export default function Unauthorized() {
  return (
    <div className="container mt-5">
      <h2>❌ Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}
