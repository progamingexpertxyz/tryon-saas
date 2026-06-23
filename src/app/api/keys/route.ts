import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/clerk";
import { generateKey } from "@/lib/api-key";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      key: true,
      name: true,
      usageCount: true,
      usageLimit: true,
      isActive: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "Default";

  const existingCount = await prisma.apiKey.count({ where: { userId: user.id } });
  if (existingCount >= 5) {
    return NextResponse.json({ error: "Maximum 5 API keys allowed." }, { status: 400 });
  }

  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, key: generateKey(), name },
  });

  return NextResponse.json({ key: apiKey }, { status: 201 });
}
