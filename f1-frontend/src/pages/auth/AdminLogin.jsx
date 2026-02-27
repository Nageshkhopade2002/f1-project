const handleLogin = async () => {
  const res = await api.post("/auth/login", { email, password });

  if (res.data.role !== "ADMIN") {
    alert("You are not an admin");
    return;
  }

  login(res.data); // save token
  navigate("/admin");
};
