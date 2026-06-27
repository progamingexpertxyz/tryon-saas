import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.delete({ where: { clerkId: userId } });

  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);

  return NextResponse.json({ ok: true });
}
