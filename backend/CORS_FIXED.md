# CORS Issue - FIXED

## Problem
Frontend on `http://localhost:8080` was getting **400 Bad Request** on OPTIONS (preflight) requests because the backend CORS configuration only allowed:
- `http://localhost:3000`
- `http://localhost:5173`

## Solution
Added `http://localhost:8080` to the CORS allowed origins in `app/core/config.py`.

## What Changed
```python
# Before
CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

# After
CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"
```

## Next Steps
**Restart the backend server** to apply the CORS fix:

```powershell
# Stop the server (Ctrl+C in the terminal)
# Then restart:
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Test Again
1. Refresh your browser
2. Try registering a user
3. Should now work without CORS errors!

---

**Status:** ✅ FIXED
**Requires:** Backend restart
