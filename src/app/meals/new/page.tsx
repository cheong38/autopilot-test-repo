"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MEAL_TYPES = ["아침", "점심", "저녁", "간식"] as const;

export default function NewMealPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      date: formData.get("date"),
      mealType: formData.get("mealType"),
      foodName: formData.get("foodName"),
      calories: Number(formData.get("calories")) || 0,
      carbs: Number(formData.get("carbs")) || 0,
      protein: Number(formData.get("protein")) || 0,
      fat: Number(formData.get("fat")) || 0,
    };

    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setErrors(body.errors || ["요청에 실패했습니다."]);
        setIsSubmitting(false);
        return;
      }

      router.push("/meals");
    } catch {
      setErrors(["네트워크 오류가 발생했습니다."]);
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        식단 입력
      </h1>

      {errors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <ul className="list-inside list-disc text-sm text-red-700 dark:text-red-400">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 날짜 */}
        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={today}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* 끼니 */}
        <div>
          <label
            htmlFor="mealType"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            끼니 <span className="text-red-500">*</span>
          </label>
          <select
            id="mealType"
            name="mealType"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">선택하세요</option>
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 음식 이름 */}
        <div>
          <label
            htmlFor="foodName"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            음식 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="foodName"
            name="foodName"
            required
            placeholder="예: 현미밥, 된장찌개"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* 칼로리 */}
        <div>
          <label
            htmlFor="calories"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            칼로리 (kcal)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            min="0"
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* 영양소 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="carbs"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              탄수화물 (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              min="0"
              step="0.1"
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="protein"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              단백질 (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              min="0"
              step="0.1"
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="fat"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              지방 (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              min="0"
              step="0.1"
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "식단 저장"}
        </button>
      </form>
    </div>
  );
}
