
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/__worker_check") {
      return new Response("CUSTOM WORKER IS RUNNING", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (
      request.method === "GET" &&
      !url.pathname.split("/").pop().includes(".")
    ) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", url.origin), {
          method: "GET",
          headers: request.headers,
        })
      );
    }

    return env.ASSETS.fetch(request);
  },
};
