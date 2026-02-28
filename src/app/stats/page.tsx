"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyStat {
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

type Period = "week" | "month";

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${month}/${day}`;
}

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?period=${period}`)
      .then((res) => res.json())
      .then((json: DailyStat[]) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [period]);

  const chartData = data.map((d) => ({
    ...d,
    label: formatDateLabel(d.date),
  }));

  const totalCalories = data.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = data.length > 0 ? Math.round(totalCalories / data.length) : 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        통계
      </h1>

      {/* Tab switcher */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setPeriod("week")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            period === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          주간
        </button>
        <button
          onClick={() => setPeriod("month")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            period === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          월간
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                총 칼로리
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCalories.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                일 평균
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgCalories.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              일별 칼로리
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  interval={period === "month" ? 2 : 0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "kcal",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 12 },
                  }}
                />
                <Tooltip
                  formatter={(value: number | string | undefined) => [
                    `${value ?? 0} kcal`,
                    "칼로리",
                  ]}
                />
                <Bar dataKey="calories" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily macronutrient breakdown table */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <h2 className="border-b border-gray-200 px-4 py-3 text-lg font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
              일별 영양소 상세
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      날짜
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                      칼로리 (kcal)
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                      탄수화물 (g)
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                      단백질 (g)
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                      지방 (g)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((stat) => (
                    <tr
                      key={stat.date}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                        {formatDateLabel(stat.date)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.calories.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.carbs}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.protein}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                        {stat.fat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
