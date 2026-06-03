from playwright.sync_api import sync_playwright

msgs = []
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # Force dark OS preference so the inline script flips data-theme to "dark"
    # — this is exactly the condition that triggered the hydration mismatch.
    page = browser.new_page(color_scheme="dark")
    page.on("console", lambda m: msgs.append((m.type, m.text)))
    page.on("pageerror", lambda e: errors.append(str(e)))

    # Next dev keeps an HMR socket open, so "networkidle" never fires — use
    # domcontentloaded and a fixed settle wait for hydration.
    resp = page.goto("http://localhost:3000/", wait_until="domcontentloaded", timeout=60000)
    print(f"GET / status:                  {resp.status if resp else 'no response'}")
    page.wait_for_selector("text=Enter the league", timeout=30000)
    page.wait_for_timeout(1500)  # let hydration settle

    theme_before = page.evaluate("document.documentElement.dataset.theme")

    # Toggle should flip the theme attribute.
    page.click("button[aria-label='Toggle light or dark theme']")
    page.wait_for_timeout(300)
    theme_after = page.evaluate("document.documentElement.dataset.theme")

    page.screenshot(path="/tmp/wc-landing.png", full_page=True)
    browser.close()

hydration = [t for t in msgs if "Hydration" in t[1] or "hydration" in t[1]]
script_warn = [t for t in msgs if "script tag" in t[1].lower()]
console_errors = [t for t in msgs if t[0] == "error"]

print(f"theme before toggle (dark OS): {theme_before}")
print(f"theme after toggle:            {theme_after}")
print(f"toggle works:                  {theme_before != theme_after}")
print(f"hydration warnings:            {len(hydration)}")
print(f"script-tag warnings:           {len(script_warn)}")
print(f"console errors:                {len(console_errors)}")
print(f"page errors:                   {len(errors)}")
if console_errors:
    print("--- console errors ---")
    for t, txt in console_errors:
        print(f"  [{t}] {txt[:200]}")
if errors:
    print("--- page errors ---")
    for e in errors:
        print(f"  {e[:200]}")
