import http.server
import socketserver
import os
import json
import threading
import time
import random
import string
import urllib.parse

PORT = 8000
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rbxwin_data.json")

lock = threading.Lock()

MODES = {
    '1v1':   {'teams': 2, 'per': 1},
    '2v2':   {'teams': 2, 'per': 2},
    '3v3':   {'teams': 2, 'per': 3},
    '1v1v1': {'teams': 3, 'per': 1},
    'ffa':   {'teams': 1, 'per': 4},
}


def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                data.setdefault("battles", {})
                data.setdefault("chat", [])
                data.setdefault("next_battle_id", 1)
                data.setdefault("next_chat_id", 1)
                return data
        except Exception:
            pass
    return {"battles": {}, "chat": [], "next_battle_id": 1, "next_chat_id": 1}


STATE = load_data()


def save_data():
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(STATE, f)
    os.replace(tmp, DATA_FILE)


def make_seed():
    def chunk():
        return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(4))
    return f"RBX-{chunk()}-{chunk()}"


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the static site AND a tiny JSON API for shared battles/chat.
    No bots anywhere — every player and every message here is real."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # keep the console readable — comment this out if you want full request logs
        if "/api/" not in (self.path or ""):
            super().log_message(fmt, *args)

    def _send_json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return {}

    # ---------------- GET ----------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/battles":
            with lock:
                battles = list(STATE["battles"].values())
            return self._send_json({"battles": battles})

        if parsed.path == "/api/chat":
            qs = urllib.parse.parse_qs(parsed.query)
            try:
                since = int(qs.get("since", ["0"])[0])
            except ValueError:
                since = 0
            with lock:
                msgs = [m for m in STATE["chat"] if m["id"] > since]
                latest = STATE["next_chat_id"] - 1
            return self._send_json({"messages": msgs, "latest": latest})

        return super().do_GET()

    # ---------------- POST ----------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        parts = [p for p in parsed.path.split("/") if p]

        # POST /api/battles  -> create a battle (creator fills the first slot)
        if parsed.path == "/api/battles":
            data = self._read_json()
            name = str(data.get("name", "")).strip()[:16]
            mode = data.get("mode")
            btype = data.get("type", "normal")
            cases = data.get("cases") or []
            if not name or mode not in MODES or not cases or not isinstance(cases, list):
                return self._send_json({"error": "invalid battle"}, 400)
            with lock:
                m = MODES[mode]
                teams = [[None] * m["per"] for _ in range(m["teams"])]
                teams[0][0] = name
                bid = STATE["next_battle_id"]
                STATE["next_battle_id"] += 1
                b = {
                    "id": bid,
                    "mode": mode,
                    "type": btype if btype in ("normal", "jackpot") else "normal",
                    "cases": cases,
                    "seed": make_seed(),
                    "teams": teams,
                    "createdAt": time.time(),
                }
                STATE["battles"][str(bid)] = b
                save_data()
            return self._send_json(b)

        # POST /api/battles/<id>/<action>
        if len(parts) == 4 and parts[0] == "api" and parts[1] == "battles":
            bid, action = parts[2], parts[3]
            data = self._read_json()
            name = str(data.get("name", "")).strip()[:16]
            with lock:
                b = STATE["battles"].get(bid)
                if not b:
                    return self._send_json({"error": "not found"}, 404)

                if action == "join":
                    if not name:
                        return self._send_json({"error": "name required"}, 400)
                    existing = {p for team in b["teams"] for p in team if p}
                    if name in existing:
                        return self._send_json({"error": "already in battle"}, 409)
                    placed = False
                    for team in b["teams"]:
                        for i, p in enumerate(team):
                            if p is None:
                                team[i] = name
                                placed = True
                                break
                        if placed:
                            break
                    if not placed:
                        return self._send_json({"error": "battle full"}, 409)
                    save_data()
                    return self._send_json(b)

                if action == "leave":
                    for team in b["teams"]:
                        for i, p in enumerate(team):
                            if p == name:
                                team[i] = None
                    if not any(p for team in b["teams"] for p in team):
                        del STATE["battles"][bid]
                        save_data()
                        return self._send_json({"ok": True, "removed": True})
                    save_data()
                    return self._send_json(b)

                if action == "complete":
                    if bid in STATE["battles"]:
                        del STATE["battles"][bid]
                        save_data()
                    return self._send_json({"ok": True})

            return self._send_json({"error": "unknown action"}, 400)

        # POST /api/chat -> post a chat message, visible to everyone
        if parsed.path == "/api/chat":
            data = self._read_json()
            with lock:
                mid = STATE["next_chat_id"]
                STATE["next_chat_id"] += 1
                msg = {
                    "id": mid,
                    "av": data.get("av") or "",
                    "n": str(data.get("n", "Anon"))[:20],
                    "system": bool(data.get("system")),
                    "sys": bool(data.get("sys")),
                    "color": data.get("color") or "",
                    "icon": data.get("icon") or "",
                    "level": data.get("level") or "",
                    "text": str(data.get("text", ""))[:200],
                    "ts": time.time(),
                }
                STATE["chat"].append(msg)
                if len(STATE["chat"]) > 300:
                    STATE["chat"] = STATE["chat"][-300:]
                save_data()
            return self._send_json(msg)

        return self._send_json({"error": "not found"}, 404)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving on http://0.0.0.0:{PORT}")
        print("Open http://localhost:{}/ yourself, and share your machine's".format(PORT))
        print("LAN/public IP + this port with others so they hit the same server")
        print("(same shared battles + chat for everyone, no cache, no bots).")
        httpd.serve_forever()
