# PocketPad Bridge Test (free proof of concept)

## What this test does
- The iPhone controller sends ordinary keyboard-like messages over PeerJS.
- `bridge.js` runs in the currently open GeForce NOW Safari page and dispatches synthetic JavaScript `KeyboardEvent`s.
- This is **not** a Bluetooth/Xbox controller, not a trusted physical key event, and not a simulated touchscreen tap. GeForce NOW or the streamed game may ignore it.

## 1. Publish files with GitHub Pages
1. Put `controller.html` and `bridge.js` in the root of the same GitHub Pages repository.
2. Keep your existing `index.html` if you want; this test uses `controller.html`.
3. Wait until GitHub Pages has published the changes.
4. Replace `YOUR-USERNAME` and `YOUR-REPO` in the bookmarklet URL below.

## 2. Make an iPad bookmarklet
1. On iPad, open any ordinary webpage in Safari and bookmark it.
2. Edit that bookmark and give it the name `Start PocketPad Bridge`.
3. Replace its URL/address with this one-line code (after replacing the two placeholders):

javascript:(()=>{const s=document.createElement('script');s.src='https://YOUR-USERNAME.github.io/YOUR-REPO/bridge.js';(document.head||document.documentElement).appendChild(s)})()

4. Open GeForce NOW in a normal Safari tab (not the Home Screen icon) and enter a game.
5. Tap the address bar, type `Start PocketPad Bridge`, and choose the bookmark suggestion. If Safari navigates instead of running it, the bookmarklet was not saved correctly.

## 3. Connect the iPhone
1. The PocketPad bridge panel should appear in the GeForce NOW tab on the iPad.
2. Copy the Bridge ID displayed in that panel.
3. On the iPhone, open `https://YOUR-USERNAME.github.io/YOUR-REPO/controller.html`.
4. Paste the Bridge ID and tap Connect.
5. Press A once. The iPad bridge panel should report `Enter DOWN`, then `Enter UP`.

## 4. Interpret the result
- If the panel reports DOWN/UP, the iPhone-to-GeForce-NOW-tab data path works.
- Then check whether the game itself reacts. It may not: synthetic keyboard events are untrusted and GeForce NOW may ignore them.
- If no reaction occurs, this test has still told us the browser bridge works, but it has **not** solved game input. Do not infer that a virtual Xbox controller has been created.

## Troubleshooting
- If the panel says PeerJS unavailable, the page's content-security policy or network may be blocking the CDN.
- If the bridge ID appears but the iPhone cannot connect, check that both devices have internet access and that the iPad tab stays open.
- PeerJS uses a hosted signaling service and a CDN. This test is free to try but is not strictly LAN-only and depends on third-party services.
- To stop the bridge, tap Close on its panel and reload GeForce NOW.
