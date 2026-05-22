import FlowStep from "./FlowStep";
import Panel from "../ui/Panel";

export default function AuthLayout({ title, text, children }) {
  return (
    <section className="auth-layout">
      <Panel
        eyebrow="Account security"
        title={title}
        text={text}
        className="auth-card"
      >
        {children}
      </Panel>

      <div className="flow-card">
        <FlowStep
          number="01"
          title="Request"
          text="Client application begins the authorization flow."
        />
        <FlowStep
          number="02"
          title="Authenticate"
          text="User signs in with OpenID Mini."
        />
        <FlowStep
          number="03"
          title="Consent"
          text="User approves requested scopes."
        />
        <FlowStep
          number="04"
          title="Code"
          text="A short-lived authorization code is returned."
        />
        <FlowStep
          number="05"
          title="Token"
          text="Client exchanges code for tokens."
        />
      </div>
    </section>
  );
}
