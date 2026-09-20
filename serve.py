#!/usr/bin/env python3
"""Local preview server that behaves like GitHub Pages.

Plain `python3 -m http.server` returns 404 for extensionless URLs such as
/services, so previews would not match the live site. This adds the two
behaviours GitHub Pages provides:

  * /services     -> serves services.html
  * anything else -> serves 404.html with a real 404 status

Usage:  python3 serve.py [port]        (default port 8000)
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def send_head(self):
        path = self.translate_path(self.path)
        # /services -> services.html
        if not os.path.exists(path) and not self.path.endswith("/"):
            if os.path.isfile(path + ".html"):
                self.path = self.path.split("?")[0] + ".html"
        return super().send_head()

    def send_error(self, code, message=None, explain=None):
        if code == 404 and os.path.isfile(os.path.join(ROOT, "404.html")):
            with open(os.path.join(ROOT, "404.html"), "rb") as fh:
                body = fh.read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print("SUPP360 site preview: http://localhost:%d  (Ctrl+C to stop)" % port)
    http.server.ThreadingHTTPServer(("127.0.0.1", port), PagesHandler).serve_forever()
