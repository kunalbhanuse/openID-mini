export const pageTitles = {
  "/": "Secure identity flows for modern applications",
  "/login": "Sign in to OpenID Mini",
  "/signup": "Create your OpenID Mini account",
  "/clients": "Register trusted client applications",
  "/oauth-test": "Start an authorization request",
  "/consent": "Review application access",
  "/oauth-callback": "Authorization response received",
};

export function getPageTitle(pathname) {
  return pageTitles[pathname] || pageTitles["/"];
}
