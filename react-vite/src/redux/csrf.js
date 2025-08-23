// src/redux/csrf.js
import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  const opts = { method: "GET", ...options };
  opts.headers = opts.headers || {};

  // Always send cookies (session + csrf) across origins/proxy
  opts.credentials = "include";

  // For non-GET, set JSON and XSRF header
  if (opts.method.toUpperCase() !== "GET") {
    opts.headers["Content-Type"] =
      opts.headers["Content-Type"] || "application/json";

    // If you're setting a CSRF cookie named XSRF-TOKEN (typical a/A setup)
    const token = Cookies.get("XSRF-TOKEN");
    if (token) opts.headers["XSRF-Token"] = token;

    // If your backend expects 'csrf_token' (underscore) instead,
    // uncomment the next two lines and ensure the cookie name matches server:
    // const token2 = Cookies.get("csrf_token");
    // if (token2) opts.headers["X-CSRFToken"] = token2;
  }

  const res = await fetch(url, opts);

  // Optional: make failures obvious to callers (thunks can catch)
  if (!res.ok) {
    let errBody = {};
    try {
      errBody = await res.clone().json();
    } catch (_) {
      // ignore parse errors
    }
    const error = new Error(errBody?.error || `Request failed: ${res.status}`);
    error.status = res.status;
    error.body = errBody;
    throw error;
  }

  return res;
}

// Dev helper to seed the CSRF cookie
export function restoreCSRF() {
  if (import.meta.env.MODE !== "production") {
    return csrfFetch("/api/csrf/restore");
  }
}