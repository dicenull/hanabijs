import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.151.0/http/server.ts";

serve((req) => {
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
