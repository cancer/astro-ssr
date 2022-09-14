import { parse, serialize } from "cookie";

addEventListener("fetch", (ev) => {
  const handler = async (ev) => {
    const url = new URL(ev.request.url);
    const sid = parse(ev.request.headers.get("cookie") ?? "")["astro-ssr"];
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "http://localhost:3001");
    headers.append("Access-Control-Allow-Credentials", "true");

    if (url.pathname === "/login/") {
      if (sid !== undefined) return new Response("", { status: 204, headers });

      const name = url.searchParams.get("name");
      if (name === null || name === "")
        return new Response("Name is invalid.", { status: 400, headers });

      const newSid = String(Date.now());
      await SESSION.put(newSid, JSON.stringify({ name }));
      headers.append(
        "Set-Cookie",
        serialize("astro-ssr", newSid, {
          maxAge: 60 * 60,
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
        })
      );

      return new Response("", {
        status: 200,
        headers,
      });
    }

    if (url.pathname === "/auth/") {
      console.log(sid);
      if (sid === undefined)
        return new Response("Authorization required.", {
          status: 401,
          headers,
        });

      const user = await SESSION.get(sid, { type: "json" });
      if (user === null) return new Response("", { status: 404, headers });

      return new Response(JSON.stringify({ user }), { status: 200, headers });
    }

    return new Response("Hello world", { status: 200, headers });
  };

  ev.respondWith(handler(ev));
});
