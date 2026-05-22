import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/forms/FormInput";
import Notice from "../components/ui/Notice";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api("/o/user/signUp", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage("Account created successfully. You can sign in now.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Create a secure account"
      text="This account represents the resource owner who approves access for client applications."
    >
      <form onSubmit={submit} className="form">
        {message && <Notice type="success">{message}</Notice>}
        {error && <Notice type="error">{error}</Notice>}
        <FormInput
          label="Full name"
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
        />
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
          Create account
        </button>
        <button type="button" onClick={() => navigate("/login")}>
          Back to sign in
        </button>
      </form>
    </AuthLayout>
  );
}
