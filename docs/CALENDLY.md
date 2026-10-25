# Calendly Integration Guide

This guide describes how to configure Calendly to automatically create Google Meet conference links and sync with the Kraqen Innovations calendar.

## 1. Create a 30 Minute Event Type in Calendly

1. Log in to [Calendly](https://calendly.com).
2. Click **Create** > **Event Type** > **One-on-One**.
3. **Event name:** `30 Minute Meeting`
4. **Duration:** `30 min`
5. **Location:** Select **Google Meet**.
   - If Google Calendar is connected, Calendly automatically generates a unique Google Meet link for every booked session.
6. **Availability:** Set to Monday through Saturday, 10:00 AM – 6:00 PM IST (`Asia/Kolkata`).
7. **Notice:** Set minimum scheduling notice to 12 hours.

## 2. Link with Kraqen Innovations Website

1. Copy your Calendly scheduling link (e.g., `https://calendly.com/kraqen-innovations/30min`).
2. Open `content/site.json`.
3. In the `"booking"` block, set:
   ```json
   "booking": {
     "provider": "calendly",
     "calendlyUrl": "https://calendly.com/your-org/30min"
   }
   ```
4. Save the file or update it via `/admin`.
5. Run `npm run content:check` to verify the configuration.

## 3. Fallback Mechanism

- When `provider` is set to `"calendly"` and `calendlyUrl` is provided, the footer on `/about` renders the iframe embed with purple/dark branding parameters:
  `?hide_gdpr_banner=1&background_color=151515&text_color=ffffff&primary_color=3D5AFE`
- If `calendlyUrl` is empty or if the iframe fails to load within 8 seconds (e.g., due to network restrictions or adblockers), the interface seamlessly switches to the builtin Kraqen booking scheduler without UI disruption.

