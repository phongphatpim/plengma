# PlengMa Deployment Guide

## Environment Variables (Vercel)

| Variable | Required | Notes |
|---|---|---|
| GOOGLE_SHEETS_ID | Yes | Sheet ID จาก URL |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | Yes | Service account email |
| GOOGLE_PRIVATE_KEY | Yes | ใส่ใน quotes, แทน `\n` ด้วย newline จริง |
| RESEND_API_KEY | Yes | สำหรับ confirmation email |
| NEXT_PUBLIC_SITE_URL | Yes | https://plengma.com |

## Google Sheets Setup

1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อ Sheet tab: **Submissions**
3. Row 1 (headers): timestamp | catalogId | title | artist | genre | duration | youtubeUrl | description | artistEmail | socialUrl | tools | coverMode | coverPrompt | status | curatorNote | rejectionReason
4. แชร์ Sheet ให้ `GOOGLE_SERVICE_ACCOUNT_EMAIL` มีสิทธิ์ Editor

## Post-Deploy Checklist

- [ ] เปิด https://plengma.com/shelf → แผงโหลด
- [ ] กดเทป → modal เปิด
- [ ] เปิด /submit → กรอก form → submit → ได้รับ email ยืนยัน
- [ ] ตรวจ Google Sheets มี row ใหม่
- [ ] เปิด /about → content ถูกต้อง
- [ ] ทดสอบ mobile บน iPhone/Android จริง
