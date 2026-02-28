import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        Meal Manager
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        Track your daily meals and nutritional intake with ease.
      </p>
      <div className="flex gap-4">
        <Link
          href="/meals"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          View Meals
        </Link>
        <Link
          href="/meals/new"
          className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          Add Meal
        </Link>
      </div>
    </div>
  );
}
