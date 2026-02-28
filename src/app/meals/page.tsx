import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MEAL_TYPE_BADGE: Record<string, string> = {
  "아침": "bg-blue-100 text-blue-800",
  "점심": "bg-green-100 text-green-800",
  "저녁": "bg-orange-100 text-orange-800",
  "간식": "bg-purple-100 text-purple-800",
};

function formatDateKorean(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default async function MealsPage() {
  const meals = await prisma.meal.findMany({
    orderBy: [{ date: "desc" }, { mealType: "asc" }],
  });

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          기록된 식단이 없습니다
        </p>
        <Link
          href="/meals/new"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          첫 식단을 입력해보세요
        </Link>
      </div>
    );
  }

  // Group meals by date
  const grouped = new Map<string, typeof meals>();
  for (const meal of meals) {
    const key = new Date(meal.date).toISOString().split("T")[0];
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(meal);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          식단 목록
        </h1>
        <Link
          href="/meals/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          식단 추가
        </Link>
      </div>

      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([dateKey, dateMeals]) => (
          <section key={dateKey}>
            <h2 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
              {formatDateKorean(new Date(dateKey + "T00:00:00"))}
            </h2>
            <ul className="space-y-2">
              {dateMeals.map((meal) => (
                <li
                  key={meal.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${MEAL_TYPE_BADGE[meal.mealType] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {meal.mealType}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {meal.foodName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>탄 {meal.carbs}g</span>
                      <span>단 {meal.protein}g</span>
                      <span>지 {meal.fat}g</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {meal.calories} kcal
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
