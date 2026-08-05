import asyncio
import io
import csv
import logging
import os
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

import requests
import resend
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="ShuruKar API")
api_router = APIRouter(prefix="/api")

# --- Object storage (Emergent) ---
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "shurukar"
storage_key = None

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "pdf": "application/pdf",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# --- Models ---
AGE_GROUPS = ["Under 18", "18-25", "25-35", "35-45", "45+"]
STAGES = ["Bas idea hai", "Shuru kar chuka hoon", "Already chal raha hai"]


class IdeaSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    mobile: str
    email: Optional[str] = None
    city: str
    age_group: str
    idea: Optional[str] = None
    needs_inspiration: bool = False
    stage: Optional[str] = None
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    notify_consent: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class IdeaSubmissionCreate(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    city: str
    age_group: str
    idea: Optional[str] = None
    needs_inspiration: bool = False
    stage: Optional[str] = None
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    notify_consent: bool = True

    @field_validator("full_name", "city")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = (v or "").strip()
        if len(v) < 2:
            raise ValueError("Yeh field theek se bhariye")
        return v

    @field_validator("mobile")
    @classmethod
    def valid_mobile(cls, v: str) -> str:
        digits = "".join(ch for ch in (v or "") if ch.isdigit())[-10:]
        if len(digits) != 10 or digits[0] not in "6789":
            raise ValueError("Mobile number check kar lijiye")
        return digits

    @field_validator("age_group")
    @classmethod
    def valid_age(cls, v: str) -> str:
        if v not in AGE_GROUPS:
            raise ValueError("Age group select kariye")
        return v

    @field_validator("notify_consent")
    @classmethod
    def consent_required(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Notification consent zaroori hai")
        return v


# --- Baseline numbers so the live dashboard reflects the real campaign, not zero ---
BASELINE_IDEAS = 5127
BASELINE_CITIES = 412


def build_confirmation_html(name: str) -> str:
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF9F3;padding:32px 0;font-family:Arial,Helvetica,sans-serif">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:32px">
      <tr><td style="font-size:22px;font-weight:bold;color:#1A1A1A;padding-bottom:12px">Shukriya, {name}!</td></tr>
      <tr><td style="font-size:15px;color:#4B5563;line-height:24px;padding-bottom:16px">
        Aapka idea humtak pahunch gaya hai. Jaise hi ShuruKar app live hoga, aapko sabse pehle batayenge.
      </td></tr>
      <tr><td style="font-size:15px;color:#4B5563;line-height:24px;padding-bottom:24px">
        Har business ek idea se shuru hota hai. ShuruKar us idea ko direction deta hai.
      </td></tr>
      <tr><td style="font-size:14px;color:#C2410C;font-weight:bold">Hokar Nidar... Shuru Kar.</td></tr>
      <tr><td style="font-size:12px;color:#9CA3AF;padding-top:24px">ShuruKar &middot; The Bharat Project &middot; YourStory</td></tr>
    </table>
  </td></tr>
</table>
"""


async def send_confirmation_email(to_email: str, name: str):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logger.warning("RESEND_API_KEY not set - skipping confirmation email")
        return
    resend.api_key = api_key
    params = {
        "from": os.environ.get("SENDER_EMAIL", "onboarding@resend.dev"),
        "to": [to_email],
        "subject": "Aapka idea humtak pahunch gaya - ShuruKar",
        "html": build_confirmation_html(name),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logger.error(f"Confirmation email failed: {e}")


# --- Routes ---
@api_router.get("/")
async def root():
    return {"message": "ShuruKar API"}


@api_router.post("/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File 8MB se chhoti honi chahiye")
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    if ext not in MIME_TYPES:
        raise HTTPException(status_code=400, detail="Sirf image ya PDF file upload kariye")
    path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, MIME_TYPES[ext])
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=502, detail="File upload nahi ho paayi, dobara try kariye")
    await db.uploads.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": MIME_TYPES[ext],
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "filename": file.filename}


@api_router.get("/files/{path:path}")
async def download(path: str):
    record = await db.uploads.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))


@api_router.post("/submit-idea", response_model=IdeaSubmission)
async def submit_idea(payload: IdeaSubmissionCreate):
    # NOTE: This is the single conversion point. To wire a real CRM / Google Sheet /
    # WhatsApp campaign later, hook it here (or consume GET /api/admin/export.csv).
    obj = IdeaSubmission(**payload.model_dump())
    await db.idea_submissions.insert_one(obj.model_dump())
    if obj.email:
        asyncio.create_task(send_confirmation_email(obj.email, obj.full_name))
    return obj


@api_router.get("/stats")
async def stats():
    total = await db.idea_submissions.count_documents({})
    cities = await db.idea_submissions.distinct("city")
    today = datetime.now(timezone.utc).date().isoformat()
    today_count = await db.idea_submissions.count_documents({"created_at": {"$gte": today}})

    age_counts = {g: 0 for g in AGE_GROUPS}
    async for doc in db.idea_submissions.find({}, {"_id": 0, "age_group": 1}):
        if doc.get("age_group") in age_counts:
            age_counts[doc["age_group"]] += 1
    real_age_total = sum(age_counts.values())

    return {
        "total_ideas": BASELINE_IDEAS + total,
        "cities": BASELINE_CITIES + len({c.strip().lower() for c in cities if c}),
        "today": today_count,
        "real_submissions": total,
        "age_breakdown": [{"group": g, "count": age_counts[g]} for g in AGE_GROUPS],
        "age_data_is_illustrative": real_age_total < 20,
    }


@api_router.get("/recent-submissions")
async def recent_submissions(limit: int = 10):
    docs = await db.idea_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return [
        {
            "city": d.get("city"),
            "idea": (d.get("idea") or "Inspiration chahiye")[:60],
            "created_at": d.get("created_at"),
        }
        for d in docs
    ]


@api_router.get("/admin/export.csv")
async def export_csv():
    # Export for the app-launch migration campaign.
    docs = await db.idea_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100000)
    buf = io.StringIO()
    cols = ["id", "full_name", "mobile", "email", "city", "age_group", "idea",
            "needs_inspiration", "stage", "attachment_path", "attachment_name",
            "notify_consent", "created_at"]
    w = csv.DictWriter(buf, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for d in docs:
        w.writerow(d)
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=shurukar-submissions.csv"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
