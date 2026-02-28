import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface DailyStat {
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "week";

  if (period !== "week" && period !== "month") {
    return NextResponse.json(
      { error: "period must be 'week' or 'month'" },
      { status: 400 }
    );
  }

  const days = period === "week" ? 7 : 30;

  // Calculate date range: today and the previous (days-1) days
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1), 0, 0, 0, 0);

  // Fetch meals in the date range
  const meals = await prisma.meal.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Build a map of date -> aggregated stats
  const statsMap = new Map<string, DailyStat>();

  // Pre-fill all dates with zeros
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    statsMap.set(key, {
      date: key,
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    });
  }

  // Aggregate meal data by date
  for (const meal of meals) {
    const key = new Date(meal.date).toISOString().split("T")[0];
    const existing = statsMap.get(key);
    if (existing) {
      existing.calories += meal.calories;
      existing.carbs += meal.carbs;
      existing.protein += meal.protein;
      existing.fat += meal.fat;
    }
  }

  // Sort by date ascending and round floats
  const result = Array.from(statsMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((stat) => ({
      ...stat,
      carbs: Math.round(stat.carbs * 10) / 10,
      protein: Math.round(stat.protein * 10) / 10,
      fat: Math.round(stat.fat * 10) / 10,
    }));

  return NextResponse.json(result);
}
