# Android APK Build Instructions (Trusted Web Activity)

This guide documents how to package the **Kraqen Innovations LLP** Progressive Web App (PWA) into an installable Android APK and Google Play AAB bundle using **Trusted Web Activity (TWA)**.

Because a TWA wraps the live web application:
- Website updates, design changes, and JSON content edits sync directly to installed apps in real-time.
- No need to recompile or redistribute the APK for content or style updates.

---

## Prerequisites
- Production website URL: `https://www.kraqeninc.com`
- Active web manifest: `https://www.kraqeninc.com/site.webmanifest`
- High-res icons in `public/icons/` (192px and 512px maskable)
- Node.js 18+ and Java JDK 17+ installed (for CLI builds)

---

## Method A: PWABuilder (Recommended & Easiest)

1. Navigate to [PWABuilder](https://www.pwabuilder.com/).
2. Enter the production site URL: `https://www.kraqeninc.com`.
3. Click **Start**. PWABuilder validates the manifest, service worker, and security.
4. Click **Package for Stores** and select **Android**.
5. Configure package settings:
   - **Package ID**: `com.kraqeninc.app`
   - **App Name**: `Kraqen Innovations LLP`
   - **Short / Launcher Name**: `Kraqen`
   - **Theme & Background Color**: `#0f0f0f`
   - **Display Mode**: Standalone / Full Screen
   - **Splash Screen Color**: `#0f0f0f`
6. Signing Key Options:
   - Choose **Generate new key** (or upload your existing key).
   - **IMPORTANT**: Download and store the generated `.keystore` / credentials safely. Never commit keys to git.
7. Click **Generate Package**.
8. Unzip the downloaded file:
   - `app-release-signed.apk` → Rename to `kraqen.apk` and place in `public/downloads/kraqen.apk`.
   - `app-release-bundle.aab` → Ready for Google Play Store upload.
   - Note the **SHA-256 fingerprint** of the signing key.

---

## Method B: Bubblewrap CLI (Command-Line)

Google's official CLI tool for building Android TWAs from a PWA.

### 1. Initialize the Project
```bash
npx @bubblewrap/cli init --manifest=https://www.kraqeninc.com/site.webmanifest
```

When prompted:
- **Application name**: `Kraqen Innovations LLP`
- **Short name**: `Kraqen`
- **Application ID / Package**: `com.kraqeninc.app`
- **Display mode**: `standalone`
- **Host**: `www.kraqeninc.com`
- **Start URL**: `/?source=pwa`

### 2. Generate or Specify Signing Keystore
Bubblewrap will ask to create a keystore:
- **Keystore path**: `kraqen-release.keystore`
- **Alias**: `kraqen`
- Save the password and keystore in a secure password manager.

### 3. Build Signed APK & AAB
```bash
npx @bubblewrap/cli build
```

This outputs:
- `app-release-signed.apk` (Direct installation)
- `app-release-bundle.aab` (Google Play Console upload)

### 4. Deploy the APK to Website
Copy `app-release-signed.apk` to your website's public download folder:
```bash
cp app-release-signed.apk public/downloads/kraqen.apk
```
Update `version` in `content/site.json` under `install.android.version` (e.g. `"1.0.0"`).

---

## Digital Asset Links Verification (`assetlinks.json`)

To remove the Chrome browser URL bar and run full-screen:

1. Extract the SHA-256 fingerprint from your keystore:
```bash
keytool -list -v -keystore kraqen-release.keystore -alias kraqen
```
Look for `Certificate fingerprints: SHA256: 14:6D:E9:...`

2. Update `public/.well-known/assetlinks.json`:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.kraqeninc.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

3. Verify live verification using Google's Asset Link tool:
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://www.kraqeninc.com&relation=delegate_permission/common.handle_all_urls
```

---

## Optional: Google Play Store Publishing

1. Register for a [Google Play Developer Account](https://play.google.com/console).
2. Create a new application named **Kraqen Innovations LLP**.
3. Fill in store listing, app description, privacy policy link, and contact details.
4. Upload `app-release-bundle.aab`.
5. Once approved and published, paste your Play Store link into `content/site.json`:
   ```json
   "playStoreUrl": "https://play.google.com/store/apps/details?id=com.kraqeninc.app"
   ```

---

## iOS Notice
iOS does not support APK files or TWAs. On iOS, installation is performed via Safari's native **Add to Home Screen** feature. A native iOS App Store release would require an Apple Developer account and a Capacitor/Cordova wrapper.

