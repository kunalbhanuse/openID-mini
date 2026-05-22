import { useNavigate } from "react-router-dom";
import MetricCard from "../components/ui/MetricCard";
import Notice from "../components/ui/Notice";
import PageIntro from "../components/ui/PageIntro";
import Panel from "../components/ui/Panel";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

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
            <button onClick={() => navigate("/clients")}>
              Register application
            </button>
          </>
        }
      />

      <section className="metric-grid">
        <MetricCard
          label="Protocol"
          value="OAuth 2.0"
          detail="Authorization Code Flow"
        />
        <MetricCard
          label="Identity"
          value="OIDC"
          detail="Discovery, JWKS and userinfo"
        />
        <MetricCard
          label="Runtime"
          value="MERN"
          detail="Express API + React UI"
        />
      </section>

      <section className="grid two">
        <Panel eyebrow="Session" title="Current user">
          {user ? (
            <div className="identity-card">
              <div className="avatar large">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
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
            <span>RS256 ID token, JWKS and userinfo endpoint</span>
          </div>
        </Panel>
      </section>
    </div>
  );
}
