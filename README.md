# AuthTrack – Prior-Authorization Tracker (demo)

A static demo for small practices. Runs entirely in the browser: each visitor gets
their own sample data saved in localStorage (nothing is sent to a server).

## Run locally
    npm start          # serves ./public  (or open public/index.html directly)

## Deploy to Vercel
Option A – CLI:
    npm i -g vercel
    vercel             # first run: accept defaults (framework: Other)
    vercel --prod

Option B – GitHub: push this folder to a repo, then Vercel > Add New > Project > Import.
Leave build command empty. `vercel.json` already sets the output directory to `public`.

## Before real patient data
The demo stores nothing on a server and uses case aliases, not patient names.
A production version needs: authentication, a real database, encryption,
audit logging and a HIPAA-compliant host with a signed BAA.

## Next steps (your turn)
1. Replace the `api()` function in `public/index.html` with fetch() calls to a backend.
2. Add login + roles.
3. Add deadline reminders (email/SMS).
4. Add an appeal-letter template generator.
