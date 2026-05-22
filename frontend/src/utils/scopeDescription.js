export function scopeDescription(scope) {
  const descriptions = {
    openid: "Verify your identity using an OpenID Connect ID token.",
    profile: "Share your basic profile information.",
    email: "Share your email address with the application.",
  };
  return descriptions[scope] || "Grant this requested permission.";
}
