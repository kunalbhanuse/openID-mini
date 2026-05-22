import { useSearchParams } from "react-router-dom";
import TokenBlock from "../components/oauth/TokenBlock";
import Notice from "../components/ui/Notice";
import Panel from "../components/ui/Panel";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  return (
    <Panel
      eyebrow="Redirect URI"
      title="Authorization response"
      className="callback-panel"
    >
      {error ? (
        <Notice type="error">Authorization failed: {error}</Notice>
      ) : (
        <Notice type="success">
          Authorization code received from OpenID Mini.
        </Notice>
      )}
      <div className="code-panel nested">
        <TokenBlock label="code" value={code || "none"} />
        <TokenBlock label="state" value={state || "none"} />
      </div>
    </Panel>
  );
}
