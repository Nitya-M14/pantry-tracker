import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Stores pantry.json in your project root
const DB_PATH = path.join(process.cwd(), 'pantry.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET — fetch all items
export async function GET() {
  const items = readDB();
  return NextResponse.json(items);
}

// POST — add a new item
export async function POST(req) {
  const body = await req.json();
  const items = readDB();
  const newItem = { id: randomUUID(), ...body };
  items.push(newItem);
  writeDB(items);
  return NextResponse.json(newItem, { status: 201 });
}

// PATCH — update an item's quantity
export async function PATCH(req) {
  const { id, Quantity } = await req.json();
  const items = readDB();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  items[idx].Quantity = Quantity;
  writeDB(items);
  return NextResponse.json(items[idx]);
}

// DELETE — remove an item
export async function DELETE(req) {
  const { id } = await req.json();
  const items = readDB();
  const filtered = items.filter(i => i.id !== id);
  writeDB(filtered);
  return NextResponse.json({ success: true });
}