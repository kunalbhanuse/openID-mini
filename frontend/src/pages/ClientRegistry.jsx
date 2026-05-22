import { useState } from "react";
import { api } from "../api/client";
import FormInput from "../components/forms/FormInput";
import TokenBlock from "../components/oauth/TokenBlock";
import Notice from "../components/ui/Notice";
import Panel from "../components/ui/Panel";

export default function ClientRegistry() {
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
          <FormInput
            label="Application name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
          />
          <label>
            Redirect URI
            <textarea
              value={form.redirectUris}
              onChange={(event) =>
                setForm({ ...form, redirectUris: event.target.value })
              }
              rows="4"
              required
            />
          </label>
          <button className="primary" type="submit">
            Generate credentials
          </button>
        </form>
      </Panel>

      <Panel eyebrow="Credentials" title="Client details" className="code-panel">
        {client ? (
          <>
            <Notice type="success">
              Copy the secret now. It is stored hashed on the server.
            </Notice>
            <TokenBlock label="client_id" value={client.clientId} />
            <TokenBlock label="client_secret" value={client.clientSecret} />
          </>
        ) : (
          <Notice>
            Register an application to receive a client ID and secret.
          </Notice>
        )}
      </Panel>
    </section>
  );
}
