import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mealId = Number(id);

    if (Number.isNaN(mealId)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.meal.findUnique({ where: { id: mealId } });

    if (!existing) {
      return NextResponse.json(
        { error: "해당 식단을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.meal.delete({ where: { id: mealId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete meal:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
