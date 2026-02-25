#!/usr/bin/env python3
"""
Dev server with live-reload support.
Serves files normally, plus a /livereload-check endpoint that returns
the latest modification timestamp of watched files.
"""
import os, glob, time
from http.server import SimpleHTTPRequestHandler, HTTPServer

WATCH_EXTS = ('.html', '.css', '.js')
SERVE_DIR = os.path.dirname(os.path.abspath(__file__))

def latest_mtime():
    ts = 0
    for ext in WATCH_EXTS:
        for f in glob.glob(os.path.join(SERVE_DIR, '**', '*' + ext), recursive=True):
            try:
                ts = max(ts, os.path.getmtime(f))
            except OSError:
                pass
    return str(ts)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SERVE_DIR, **kwargs)

    def do_GET(self):
        if self.path == '/livereload-check':
            body = latest_mtime().encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        # Suppress /livereload-check spam
        if '/livereload-check' not in (args[0] if args else ''):
            super().log_message(fmt, *args)

if __name__ == '__main__':
    os.chdir(SERVE_DIR)
    server = HTTPServer(('', 8080), Handler)
    print(f'Serving at http://localhost:8080  (watching {SERVE_DIR})')
    server.serve_forever()
