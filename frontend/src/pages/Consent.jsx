import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Panel from "../components/ui/Panel";
import { API_BASE } from "../config/api";
import { scopeDescription } from "../utils/scopeDescription";

export default function Consent() {
  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => ({
      clientId: searchParams.get("client_id") || "",
      redirectUri: searchParams.get("redirect_uri") || "",
      clientName: searchParams.get("client_name") || "Client application",
      userName: searchParams.get("user_name") || "User",
      scope: searchParams.get("scope") || "openid profile email",
      state: searchParams.get("state") || "",
    }),
    [searchParams],
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
      <Panel
        eyebrow="Permission request"
        title={`${params.clientName} is requesting access`}
        className="consent-card"
      >
        <div className="consent-user">
          <div className="avatar">
            {params.userName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <strong>{params.userName}</strong>
            <span>Signed in with OpenID Mini</span>
          </div>
        </div>

        <p>
          Review the requested permissions before continuing to the client
          application.
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
          <button className="primary" onClick={() => submit("allow")}>
            Allow access
          </button>
        </div>
      </Panel>
    </section>
  );
}
