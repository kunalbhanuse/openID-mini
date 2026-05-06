import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const navItems = [
  { path: "/", label: "Overview" },
  { path: "/login", label: "Sign in" },
  { path: "/signup", label: "Create user" },
  { path: "/clients", label: "Applications" },
  { path: "/oauth-test", label: "Authorize" },
];

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : body.error || body.message;
    throw new Error(message || "Request failed");
  }

  return body;
}

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setRoute(window.location.pathname);
  };

  return { route, navigate };
}

function getSearch() {
  return new URLSearchParams(window.location.search);
}

function Shell({ children, user, route, navigate, onLogout }) {
  const pageTitle = getPageTitle(route);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("/")}>
          <span className="brand-mark">OM</span>
          <span>
            <strong>OpenID Mini</strong>
            <small>Project by Kunal Bhanuse</small>
          </span>
        </button>

        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={route === item.path ? "active" : ""}
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-panel">
          <span className="mini-label">Provider endpoint</span>
          <strong>{API_BASE.replace("http://", "")}</strong>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">Identity Provider</span>
            <h1>{pageTitle}</h1>
          </div>
          <SessionBadge user={user} navigate={navigate} onLogout={onLogout} />
        </header>

        {children}
      </main>
    </div>
  );
}

function getPageTitle(route) {
  const titles = {
    "/": "Secure identity flows for modern applications",
    "/login": "Sign in to OpenID Mini",
    "/signup": "Create your OpenID Mini account",
    "/clients": "Register trusted client applications",
    "/oauth-test": "Start an authorization request",
    "/consent": "Review application access",
    "/oauth-callback": "Authorization response received",
  };
  return titles[route] || titles["/"];
}

function SessionBadge({ user, navigate, onLogout }) {
  if (!user) {
    return (
      <div className="session-badge guest">
        <span>Guest session</span>
        <button onClick={() => navigate("/login")}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="session-badge">
      <div className="avatar">{user.name?.slice(0, 2).toUpperCase()}</div>
      <div>
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

function Notice({ type = "info", children }) {
  return <div className={`notice ${type}`}>{children}</div>;
}

function PageIntro({ eyebrow, title, text, actions }) {
  return (
    <section className="hero-panel">
      <div>
        <span className="eyebrow light">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {actions && <div className="actions">{actions}</div>}
    </section>
  );
}

function Panel({ eyebrow, title, text, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
      {children}
    </section>
  );
}

function Dashboard({ user, navigate }) {
  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="OpenID Mini"
        title="A focused OAuth 2.0 and OpenID Connect learning platform."
        text="Manage users, register client applications, review consent requests, and issue identity tokens from a dedicated React interface."
        actions={
          <>
            <button className="primary" onClick={() => navigate("/oauth-test")}>
              Start authorize flow
            </button>
            <button onClick={() => navigate("/clients")}>Register application</button>
          </>
        }
      />

      <section className="metric-grid">
        <MetricCard label="Protocol" value="OAuth 2.0" detail="Authorization Code Flow" />
        <MetricCard label="Identity" value="OIDC" detail="ID token and userinfo" />
        <MetricCard label="Runtime" value="MERN" detail="Express API + React UI" />
      </section>

      <section className="grid two">
        <Panel eyebrow="Session" title="Current user">
          {user ? (
            <div className="identity-card">
              <div className="avatar large">{user.name?.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>
          ) : (
            <Notice>Sign in before opening an authorization request.</Notice>
          )}
        </Panel>

        <Panel eyebrow="Flow" title="Provider capabilities">
          <div className="feature-list">
            <span>Client application registration</span>
            <span>Login with HTTP-only cookie session</span>
            <span>Consent approval and authorization code issue</span>
            <span>Access token, ID token and userinfo endpoint</span>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Login({ navigate, refreshUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const search = getSearch();
  const redirect = search.get("redirect");

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
        <button className="primary" type="submit">Sign in</button>
        <button type="button" onClick={() => navigate("/signup")}>Create an account</button>
      </form>
    </AuthLayout>
  );
}

function Signup({ navigate }) {
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
        <FormInput label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <FormInput label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <FormInput label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
        <button className="primary" type="submit">Create account</button>
        <button type="button" onClick={() => navigate("/login")}>Back to sign in</button>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, text, children }) {
  return (
    <section className="auth-layout">
      <Panel eyebrow="Account security" title={title} text={text} className="auth-card">
        {children}
      </Panel>
      <div className="flow-card">
        <FlowStep number="01" title="Request" text="Client application begins the authorization flow." />
        <FlowStep number="02" title="Authenticate" text="User signs in with OpenID Mini." />
        <FlowStep number="03" title="Consent" text="User approves requested scopes." />
        <FlowStep number="04" title="Code" text="A short-lived authorization code is returned." />
        <FlowStep number="05" title="Token" text="Client exchanges code for tokens." />
      </div>
    </section>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div className="flow-step">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function ClientRegistry() {
  const [form, setForm] = useState({
    name: "Kunal Demo Client",
    redirectUris: "http://localhost:5173/oauth-callback",
  });
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setClient(null);

    try {
      const response = await api("/o/client/signUp", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          redirectUris: form.redirectUris
            .split("\n")
            .map((uri) => uri.trim())
            .filter(Boolean),
        }),
      });
      setClient(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="grid two">
      <Panel
        eyebrow="Client management"
        title="Register a trusted application"
        text="Create credentials for an application that will request identity access from OpenID Mini."
      >
        <form onSubmit={submit} className="form">
          {error && <Notice type="error">{error}</Notice>}
          <FormInput label="Application name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <label>
            Redirect URI
            <textarea
              value={form.redirectUris}
              onChange={(event) => setForm({ ...form, redirectUris: event.target.value })}
              rows="4"
              required
            />
          </label>
          <button className="primary" type="submit">Generate credentials</button>
        </form>
      </Panel>

      <Panel eyebrow="Credentials" title="Client details" className="code-panel">
        {client ? (
          <>
            <Notice type="success">Copy the secret now. It is stored hashed on the server.</Notice>
            <TokenBlock label="client_id" value={client.clientId} />
            <TokenBlock label="client_secret" value={client.clientSecret} />
          </>
        ) : (
          <Notice>Register an application to receive a client ID and secret.</Notice>
        )}
      </Panel>
    </section>
  );
}

function Consent() {
  const search = getSearch();
  const params = useMemo(
    () => ({
      clientId: search.get("client_id") || "",
      redirectUri: search.get("redirect_uri") || "",
      clientName: search.get("client_name") || "Client application",
      userName: search.get("user_name") || "User",
      scope: search.get("scope") || "openid profile email",
      state: search.get("state") || "",
    }),
    [],
  );

  const scopes = params.scope.split(" ").filter(Boolean);

  const submit = (decision) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${API_BASE}/consent`;

    Object.entries({
      decision,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      scope: params.scope,
      state: params.state,
    }).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <section className="consent-wrap">
      <Panel eyebrow="Permission request" title={`${params.clientName} is requesting access`} className="consent-card">
        <div className="consent-user">
          <div className="avatar">{params.userName.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{params.userName}</strong>
            <span>Signed in with OpenID Mini</span>
          </div>
        </div>

        <p>
          Review the requested permissions before continuing to the client application.
        </p>

        <div className="scope-list">
          {scopes.map((scope) => (
            <div className="scope-item" key={scope}>
              <strong>{scope}</strong>
              <span>{scopeDescription(scope)}</span>
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={() => submit("deny")}>Deny</button>
          <button className="primary" onClick={() => submit("allow")}>Allow access</button>
        </div>
      </Panel>
    </section>
  );
}

function scopeDescription(scope) {
  const descriptions = {
    openid: "Verify your identity using an OpenID Connect ID token.",
    profile: "Share your basic profile information.",
    email: "Share your email address with the application.",
  };
  return descriptions[scope] || "Grant this requested permission.";
}

function OAuthTest() {
  const [form, setForm] = useState({
    clientId: "",
    redirectUri: "http://localhost:5173/oauth-callback",
    scope: "openid profile email",
    state: "state-kunal-123",
  });

  const authorizationUrl = useMemo(() => {
    const url = new URL(`${API_BASE}/authorize`);
    url.searchParams.set("client_id", form.clientId || "{client_id}");
    url.searchParams.set("redirect_uri", form.redirectUri);
    url.searchParams.set("scope", form.scope);
    url.searchParams.set("state", form.state);
    return url.toString();
  }, [form]);

  const start = () => {
    const url = new URL(`${API_BASE}/authorize`);
    url.searchParams.set("client_id", form.clientId);
    url.searchParams.set("redirect_uri", form.redirectUri);
    url.searchParams.set("scope", form.scope);
    url.searchParams.set("state", form.state);
    window.location.href = url.toString();
  };

  return (
    <section className="grid two">
      <Panel
        eyebrow="Authorization request"
        title="Create an authorization URL"
        text="Use a registered client ID and redirect URI to begin the OpenID Mini authorization flow."
      >
        <div className="form">
          <FormInput label="Client ID" value={form.clientId} onChange={(value) => setForm({ ...form, clientId: value })} />
          <FormInput label="Redirect URI" value={form.redirectUri} onChange={(value) => setForm({ ...form, redirectUri: value })} />
          <FormInput label="Scope" value={form.scope} onChange={(value) => setForm({ ...form, scope: value })} />
          <FormInput label="State" value={form.state} onChange={(value) => setForm({ ...form, state: value })} />
          <button className="primary" onClick={start} disabled={!form.clientId}>Continue with OpenID Mini</button>
        </div>
      </Panel>

      <Panel eyebrow="Generated request" title="Authorization URL" className="code-panel">
        <TokenBlock label="GET" value={authorizationUrl} />
      </Panel>
    </section>
  );
}

function OAuthCallback() {
  const search = getSearch();
  const code = search.get("code");
  const state = search.get("state");
  const error = search.get("error");

  return (
    <Panel eyebrow="Redirect URI" title="Authorization response" className="callback-panel">
      {error ? (
        <Notice type="error">Authorization failed: {error}</Notice>
      ) : (
        <Notice type="success">Authorization code received from OpenID Mini.</Notice>
      )}
      <div className="code-panel nested">
        <TokenBlock label="code" value={code || "none"} />
        <TokenBlock label="state" value={state || "none"} />
      </div>
    </Panel>
  );
}

function TokenBlock({ label, value }) {
  return (
    <div className="token-block">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function App() {
  const { route, navigate } = useRoute();
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const response = await api("/o/user/me");
      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    await api("/o/user/logout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  const page = (() => {
    if (route === "/login") return <Login navigate={navigate} refreshUser={refreshUser} />;
    if (route === "/signup") return <Signup navigate={navigate} />;
    if (route === "/clients") return <ClientRegistry />;
    if (route === "/consent") return <Consent />;
    if (route === "/oauth-test") return <OAuthTest />;
    if (route === "/oauth-callback") return <OAuthCallback />;
    return <Dashboard user={user} navigate={navigate} />;
  })();

  return (
    <Shell user={user} route={route} navigate={navigate} onLogout={logout}>
      {page}
    </Shell>
  );
}

createRoot(document.getElementById("root")).render(<App />);
