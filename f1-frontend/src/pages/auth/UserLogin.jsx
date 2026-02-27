const handleLogin = async () => {
  const res = await api.post("/auth/login", { email, password });

  if (res.data.role !== "USER") {
    alert("Please login from admin panel");
    return;
  }

  login(res.data);
  navigate("/user");
};
