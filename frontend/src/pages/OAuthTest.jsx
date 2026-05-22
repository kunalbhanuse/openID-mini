import { useMemo, useState } from "react";
import FormInput from "../components/forms/FormInput";
import TokenBlock from "../components/oauth/TokenBlock";
import Panel from "../components/ui/Panel";
import { API_BASE } from "../config/api";

export default function OAuthTest() {
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
          <FormInput
            label="Client ID"
            value={form.clientId}
            onChange={(value) => setForm({ ...form, clientId: value })}
          />
          <FormInput
            label="Redirect URI"
            value={form.redirectUri}
            onChange={(value) => setForm({ ...form, redirectUri: value })}
          />
          <FormInput
            label="Scope"
            value={form.scope}
            onChange={(value) => setForm({ ...form, scope: value })}
          />
          <FormInput
            label="State"
            value={form.state}
            onChange={(value) => setForm({ ...form, state: value })}
          />
          <button className="primary" onClick={start} disabled={!form.clientId}>
            Continue with OpenID Mini
          </button>
        </div>
      </Panel>

      <Panel
        eyebrow="Generated request"
        title="Authorization URL"
        className="code-panel"
      >
        <TokenBlock label="GET" value={authorizationUrl} />
      </Panel>
    </section>
  );
}
