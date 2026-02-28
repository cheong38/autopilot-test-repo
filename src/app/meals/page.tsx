import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MealsPage() {
  const meals = await prisma.meal.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

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

      {meals.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-950">
          <p className="text-gray-500 dark:text-gray-400">
            등록된 식단이 없습니다.
          </p>
          <Link
            href="/meals/new"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            첫 식단을 입력해보세요
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {meal.mealType}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(meal.date).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {meal.foodName}
                  </h3>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {meal.calories} kcal
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>탄수화물 {meal.carbs}g</span>
                <span>단백질 {meal.protein}g</span>
                <span>지방 {meal.fat}g</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
