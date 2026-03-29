# Render Deployment

This repo is configured to deploy on Render as one Django web service plus one free Postgres database.

## Architecture

- Django serves the API
- React is built with Vite during deploy
- Django serves the built React SPA from the same origin
- Render Postgres is used automatically in production through `DATABASE_URL`

This same-origin setup avoids the cross-origin CSRF and session-cookie problems that would happen with a separate static frontend host.

## Files added for deployment

- `render.yaml`
- `instagram/requirements.txt`
- `frontend2/.env.example`
- `instagram/.env.example`

## Deploy

1. Push the project to GitHub.
2. In Render, choose `New > Blueprint`.
3. Select the repository.
4. Render will create:
   - `balagram` web service
   - `balagram-db` Postgres database
5. If you use post uploads with Cloudinary, add:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
6. Deploy.

## Local development

- Frontend dev server:
  - copy `frontend2/.env.example` to `frontend2/.env`
  - keep `VITE_API_BASE=http://localhost:8000`
- Backend:
  - local SQLite still works when `DATABASE_URL` is not set

## Notes

- Health check path is `/healthz/`
- Non-API routes are routed to the React app
- Static assets are served by WhiteNoise
