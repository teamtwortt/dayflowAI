/** Best-effort decode of Cognito Id token payload (unverified); same token we send as Bearer. */
export interface IdTokenClaims {
  email?: string;
  name?: string;
  given_name?: string;
  nickname?: string;
  preferred_username?: string;
}

export function decodeIdTokenClaims(token: string | null | undefined): IdTokenClaims {
  if (!token?.includes(".")) return {};
  try {
    const payload = token.split(".")[1];
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const data = JSON.parse(json) as Record<string, unknown>;
    const str = (k: string) => {
      const v = data[k];
      return typeof v === "string" && v.trim() ? v.trim() : undefined;
    };
    return {
      email: str("email"),
      name: str("name"),
      given_name: str("given_name"),
      nickname: str("nickname"),
      preferred_username: str("preferred_username"),
    };
  } catch {
    return {};
  }
}

export function displayNameFromClaims(c: IdTokenClaims): string | undefined {
  const raw =
    c.name ||
    c.given_name ||
    c.nickname ||
    c.preferred_username ||
    (c.email?.includes("@") ? c.email.split("@")[0] : undefined);
  return raw?.trim() || undefined;
}
