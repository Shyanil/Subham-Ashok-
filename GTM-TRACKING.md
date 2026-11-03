# Enquiry tracking

Container `GTM-NS9GJ7VZ` loads once from the root layout on every page, including `/thank-you`. The standard head loader and body noscript fallback are installed.

All enquiry variants share `LeadForm`. Only an HTTP-success response with `{ "ok": true }` redirects to `/thank-you`. Failed submissions stay on the form.

## Events

| Event | When |
| --- | --- |
| `form_submit` | The enquiry endpoint confirms success, before navigation. |
| `thank_you_view` | The thank-you page mounts, including direct visits and refreshes. |
| `generate_lead` | The thank-you page is reached after a confirmed successful enquiry. Consumed once; direct visits and refreshes do not repeat it. |

`generate_lead` includes `source`, `configuration`, `budget`, `form_variant`, and `page_path`. It does not include name, phone, or pincode.

## Container configuration

In GTM, use a **Custom Event** trigger named `generate_lead` for the conversion tag, then preview and publish the container. Use one conversion trigger; using both the thank-you URL and `generate_lead` for the same conversion can double count. Container configuration and publishing are separate from the website implementation.

The website queues events in `window.dataLayer` even if the async GTM download has not completed. Browser blockers can prevent GTM from loading. Existing optional GA4 and Meta integrations remain available through environment variables; avoid configuring duplicate destination tags in GTM if those integrations are enabled.

## Validation

Production build passed. A Playwright browser check with the enquiry endpoint mocked confirmed redirect, one GTM loader, one `generate_lead` event, no conversion on refresh, and no horizontal overflow at 390px. No test lead was sent to the live endpoint. Live container tag execution requires Tag Assistant validation with the published container.
