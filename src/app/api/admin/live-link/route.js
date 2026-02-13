import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.resolve(process.cwd(), 'data');
const FILE = path.join(DATA_PATH, 'live-link.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
}

export async function GET() {
  try {
    if (!fs.existsSync(FILE)) return NextResponse.json({ ok: true, data: {} });
    const raw = fs.readFileSync(FILE, 'utf8');
    const json = JSON.parse(raw || '{}');
    return NextResponse.json({ ok: true, data: json });
  } catch (e) {
    console.error('live-link GET error', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const url = body?.url || '';
    ensureDataDir();
    const payload = { url, updatedAt: new Date().toISOString() };
    fs.writeFileSync(FILE, JSON.stringify(payload, null, 2), 'utf8');
    return NextResponse.json({ ok: true, data: payload });
  } catch (e) {
    console.error('live-link POST error', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
