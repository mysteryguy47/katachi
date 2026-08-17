"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({
  id,
  name,
  redirectAfter,
}: {
  id: string;
  name: string;
  redirectAfter?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
        Delete {name}?
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteProduct(id);
              if (redirectAfter) router.push(redirectAfter);
            })
          }
          className="font-medium text-red-600 hover:underline"
        >
          {pending ? "Deleting…" : "Yes"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-ink-faint hover:text-ink"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 text-sm text-ink-faint hover:text-red-600"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
