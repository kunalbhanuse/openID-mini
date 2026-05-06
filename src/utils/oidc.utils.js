import { createPrivateKey, createPublicKey, generateKeyPairSync } from "crypto";

const issuer = process.env.ISSUER || "http://localhost:8000";
const keyId = process.env.OIDC_KEY_ID || "openid-mini-dev-key";

function normalizePem(value) {
  return value?.replace(/\\n/g, "\n");
}

function certificateToX5c(cert) {
  return normalizePem(cert)
    ?.replace("-----BEGIN CERTIFICATE-----", "")
    .replace("-----END CERTIFICATE-----", "")
    .replace(/\s+/g, "");
}

function loadKeyPair() {
  if (process.env.OIDC_PRIVATE_KEY) {
    const privateKey = createPrivateKey(normalizePem(process.env.OIDC_PRIVATE_KEY));
    const publicKey = process.env.OIDC_PUBLIC_KEY
      ? createPublicKey(normalizePem(process.env.OIDC_PUBLIC_KEY))
      : createPublicKey(privateKey);

    return { privateKey, publicKey };
  }

  return generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
}

const { privateKey, publicKey } = loadKeyPair();

function getIssuer() {
  return issuer;
}

function getPrivateKey() {
  return privateKey;
}

function getPublicJwk() {
  const jwk = {
    ...publicKey.export({ format: "jwk" }),
    kid: keyId,
    use: "sig",
    alg: "RS256",
  };

  const x5c = certificateToX5c(process.env.OIDC_CERT);
  if (x5c) {
    jwk.x5c = [x5c];
  }

  return jwk;
}

function getKeyId() {
  return keyId;
}

function getOpenIdConfiguration() {
  return {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    userinfo_endpoint: `${issuer}/userinfo`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
    claims_supported: ["sub", "iss", "aud", "exp", "iat", "name", "email"],
  };
}

export {
  getIssuer,
  getKeyId,
  getPrivateKey,
  getPublicJwk,
  getOpenIdConfiguration,
};
