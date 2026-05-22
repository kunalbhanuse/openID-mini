import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/forms/FormInput";
import Notice from "../components/ui/Notice";
import { API_BASE } from "../config/api";

export default function Login({ refreshUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetch(`${API_BASE}/o/user/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ ...form, redirect: redirect || "" }),
      redirect: "manual",
    });

    if (response.type === "opaqueredirect" || response.status === 0) {
      window.location.href = redirect || "/";
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (!response.ok) {
      setError(await response.text());
      return;
    }

    await refreshUser();
    if (redirect) {
      window.location.href = `${API_BASE}${redirect}`;
      return;
    }
    navigate("/");
  };

  return (
    <AuthLayout
      title="Access your identity workspace"
      text="Authenticate once and continue securely into registered client applications."
    >
      <form onSubmit={submit} className="form">
        {error && <Notice type="error">{error}</Notice>}
        <FormInput
          label="Email address"
          type="email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
        />
        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />
        <button className="primary" type="submit">
          Sign in
        </button>
        <button type="button" onClick={() => navigate("/signup")}>
          Create an account
        </button>
      </form>
    </AuthLayout>
  );
}
