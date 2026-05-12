"use client";

import { Suspense } from "react";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto space-y-4">
        <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-brutal animate-pulse" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
