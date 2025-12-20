import urllib.request
import time
import sys

URL = "http://localhost:8055/server/health"

print(f"⏳ Waiting for Directus at {URL}...")

for i in range(30):
    try:
        with urllib.request.urlopen(URL) as res:
            if res.status == 200:
                print("✅ Directus is UP!")
                sys.exit(0)
    except:
        pass
    print(".", end="", flush=True)
    time.sleep(2)

print("\n❌ Timed out waiting for Directus.")
sys.exit(1)
