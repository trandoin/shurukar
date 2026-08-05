"""ShuruKar backend API tests."""
import io
import os
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://nidar-shuru.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


def _tiny_png_bytes() -> bytes:
    # 1x1 transparent PNG
    sig = b"\x89PNG\r\n\x1a\n"
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0)
    idat = zlib.compress(b"\x00\x00\x00\x00\x00")
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


# --- submit-idea validation ---
class TestSubmitIdea:
    def test_valid_submission(self, session):
        payload = {
            "full_name": "Test User",
            "mobile": "9876543210",
            "city": "Jaipur",
            "age_group": "25-35",
            "idea": "AI mentor for kirana stores",
            "stage": "Bas idea hai",
            "notify_consent": True,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and data["id"]
        assert "created_at" in data and data["created_at"]
        assert data["full_name"] == "Test User"
        assert data["mobile"] == "9876543210"

    def test_invalid_mobile_short(self, session):
        payload = {
            "full_name": "Test User",
            "mobile": "12345",
            "city": "Jaipur",
            "age_group": "25-35",
            "idea": "x",
            "notify_consent": True,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 422

    def test_invalid_mobile_prefix(self, session):
        # starts with 5 -> not in 6789
        payload = {
            "full_name": "Test User",
            "mobile": "5876543210",
            "city": "Jaipur",
            "age_group": "25-35",
            "notify_consent": True,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 422

    def test_consent_false_rejected(self, session):
        payload = {
            "full_name": "Test User",
            "mobile": "9876543210",
            "city": "Jaipur",
            "age_group": "25-35",
            "notify_consent": False,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 422

    def test_invalid_age_group(self, session):
        payload = {
            "full_name": "Test User",
            "mobile": "9876543210",
            "city": "Jaipur",
            "age_group": "100+",
            "notify_consent": True,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 422

    def test_needs_inspiration_without_idea(self, session):
        payload = {
            "full_name": "No Idea User",
            "mobile": "9876500000",
            "city": "Lucknow",
            "age_group": "18-25",
            "needs_inspiration": True,
            "notify_consent": True,
        }
        r = session.post(f"{API}/submit-idea", json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["needs_inspiration"] is True


# --- stats + recent + csv ---
class TestReadEndpoints:
    def test_stats_structure_and_increment(self, session):
        s1 = session.get(f"{API}/stats").json()
        assert "total_ideas" in s1 and s1["total_ideas"] >= 5127
        assert "cities" in s1 and s1["cities"] >= 412
        assert "today" in s1
        assert isinstance(s1["age_breakdown"], list) and len(s1["age_breakdown"]) == 5
        groups = [x["group"] for x in s1["age_breakdown"]]
        assert groups == ["Under 18", "18-25", "25-35", "35-45", "45+"]
        assert "age_data_is_illustrative" in s1 and isinstance(s1["age_data_is_illustrative"], bool)

        # Submit and confirm increment
        session.post(f"{API}/submit-idea", json={
            "full_name": "Increment User",
            "mobile": "9800000001",
            "city": "Pune",
            "age_group": "35-45",
            "idea": "test increment",
            "notify_consent": True,
        }).raise_for_status()
        s2 = session.get(f"{API}/stats").json()
        assert s2["total_ideas"] >= s1["total_ideas"] + 1

    def test_recent_submissions_anonymised(self, session):
        r = session.get(f"{API}/recent-submissions?limit=10")
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        for item in arr:
            assert set(item.keys()) == {"city", "idea", "created_at"}
            assert "full_name" not in item and "mobile" not in item

    def test_export_csv(self, session):
        r = session.get(f"{API}/admin/export.csv")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        body = r.text
        lines = body.strip().splitlines()
        assert lines[0].startswith("id,full_name,mobile")
        assert len(lines) >= 2  # header + at least the one row we submitted


# --- upload/download ---
class TestUpload:
    def test_png_upload_and_download(self, session):
        png = _tiny_png_bytes()
        r = session.post(f"{API}/upload", files={"file": ("t.png", png, "image/png")})
        assert r.status_code == 200, r.text
        j = r.json()
        assert "path" in j and j["filename"] == "t.png"
        g = session.get(f"{API}/files/{j['path']}")
        assert g.status_code == 200
        assert g.headers.get("content-type", "").startswith("image/png")
        assert len(g.content) == len(png)

    def test_reject_txt(self, session):
        r = session.post(f"{API}/upload", files={"file": ("t.txt", b"hello", "text/plain")})
        assert r.status_code == 400

    def test_reject_exe(self, session):
        r = session.post(f"{API}/upload", files={"file": ("m.exe", b"MZ...", "application/octet-stream")})
        assert r.status_code == 400
