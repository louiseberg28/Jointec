# Jointec Leads: Cloudflare D1 + Email Setup

The website signup form stores leads in Cloudflare D1 and can send emails with Resend.

## Cloudflare Pages Bindings

Create a D1 database in Cloudflare named `jointec-leads`.

In the Jointec Pages project, add a D1 binding:

```txt
Variable name: JOINTEC_DB
Database: jointec-leads
```

## Cloudflare Environment Variables

Add these production environment variables:

```txt
ADMIN_PASSWORD=choose-a-private-password
ADMIN_SESSION_SECRET=generate-a-long-random-secret
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Jointec <updates@jointec.se>
LEAD_NOTIFY_EMAIL=info@jointec.se
```

`RESEND_FROM_EMAIL` must use a sender/domain verified in Resend.

## Admin Database

Open:

```txt
https://jointec.se/admin/leads
```

Log in with `ADMIN_PASSWORD`.

The page can search, filter, update lead status/notes, and export a CSV file that opens in Excel.

