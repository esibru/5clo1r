from flask import Flask, jsonify, render_template
import threading, time, os

app = Flask(__name__)

# États internes
is_alive = True
is_ready = False

# Initialisation simulée
def simulated_initialization():
    global is_ready
    print("[Init] Initialisation en cours...")
    time.sleep(5)
    is_ready = True
    print("[Init] Application prête (is_ready=True)")

threading.Thread(target=simulated_initialization, daemon=True).start()

def get_container_id():
    try:
        with open("/proc/self/cgroup") as f:
            for line in f:
                if "docker" in line or "kubepods" in line:
                    return line.strip().split("/")[-1][:12]
    except Exception:
        return "unknown"

@app.route("/")
def index():
    bg_color = os.getenv("BG_COLOR", "#ffffff")

    env_vars = {
        "POD_NAME": os.getenv("HOSTNAME", "unknown"),
        "POD_IP": os.getenv("POD_IP", "unknown"),
        "NAMESPACE": os.getenv("NAMESPACE", "default"),
        "CONTAINER_NAME": os.getenv("CONTAINER_NAME", "unknown"),
        "NODE_NAME": os.getenv("NODE_NAME", "unknown"),
        "CONTAINER_ID": get_container_id()
    }

    secrets = {
        "DATABASE_URL": os.getenv("DATABASE_URL", "N/A"),
        "API_KEY": os.getenv("API_KEY", "N/A"),
        "JWT_SECRET": os.getenv("JWT_SECRET", "N/A")
    }

    configmap_vars = {
        "LOG_LEVEL": os.getenv("LOG_LEVEL", "N/A"),
        "MAX_CONNECTIONS": os.getenv("MAX_CONNECTIONS", "N/A"),
        "CACHE_TIMEOUT": os.getenv("CACHE_TIMEOUT", "N/A"),
        "FEATURE_FLAG_NEW_UI": os.getenv("FEATURE_FLAG_NEW_UI", "N/A"),
        "APP_CONFIG": os.getenv("APP_CONFIG", "N/A")
    }

    return render_template(
        "index.html",
        app_env=os.getenv("APP_ENV", "development"),
        version=os.getenv("VERSION", "0.1.0"),
        is_alive=is_alive,
        is_ready=is_ready,
        bg_color=bg_color,
        env_vars=env_vars,
        secrets=secrets,
        configmap_vars=configmap_vars
    )

@app.route("/api/info")
def api_info():
    return jsonify({
        "message": "Hello from Flask on Kubernetes!",
        "env": {"APP_ENV": os.getenv("APP_ENV", "development"), "VERSION": os.getenv("VERSION", "0.1.0")},
        "status": {"liveness": is_alive, "readiness": is_ready}
    })

@app.route("/liveness")
def liveness():
    return jsonify({"status": is_alive}), (200 if is_alive else 500)

@app.route("/readiness")
def readiness():
    return jsonify({"status": is_ready}), (200 if is_ready else 503)

@app.route("/toggle/liveness", methods=["POST"])
def toggle_liveness():
    global is_alive
    is_alive = not is_alive
    return jsonify({"liveness": is_alive})

@app.route("/toggle/readiness", methods=["POST"])
def toggle_readiness():
    global is_ready
    is_ready = not is_ready
    return jsonify({"readiness": is_ready})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))

