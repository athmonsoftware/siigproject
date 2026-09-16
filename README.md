# SIIG website

Public website for Safety Innovations Impact Group. It has six pages: Home, Services, Our Method, About, Community, and Contact.

## Development

```sh
npm ci
npm run dev
```

## Vercel deployment

Import `athmonsoftware/siigproject` into Vercel. The framework is Vite, the build command is `npm run build`, and the output directory is `dist`. No environment variables are required for this static site.

The contact form composes an email in the visitor's email app. It does not send or store messages on a server. Before relying on the form for client enquiries, connect it to a delivery service and verify the recipient address and phone number with SIIG.
