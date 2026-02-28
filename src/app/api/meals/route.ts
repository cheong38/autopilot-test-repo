import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_MEAL_TYPES = ["아침", "점심", "저녁", "간식"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { date, mealType, foodName, calories, carbs, protein, fat } = body;

    // Validation: required fields
    const errors: string[] = [];

    if (!date) {
      errors.push("날짜를 입력해주세요.");
    }

    if (!mealType) {
      errors.push("끼니를 선택해주세요.");
    } else if (!VALID_MEAL_TYPES.includes(mealType)) {
      errors.push("올바른 끼니를 선택해주세요. (아침/점심/저녁/간식)");
    }

    if (!foodName || (typeof foodName === "string" && foodName.trim() === "")) {
      errors.push("음식 이름을 입력해주세요.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const meal = await prisma.meal.create({
      data: {
        date: new Date(date),
        mealType,
        foodName: foodName.trim(),
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
      },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Failed to create meal:", error);
    return NextResponse.json(
      { errors: ["서버 오류가 발생했습니다."] },
      { status: 500 }
    );
  }
}
