import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

import type { FieldErrorResponse } from "@/lib/types/api-response";

export function applyFieldErrors<T extends FieldValues>(
  fieldErrors: FieldErrorResponse[] | undefined,
  setError: UseFormSetError<T>,
  knownFields: Path<T>[],
) {
  if (!fieldErrors?.length) return;
  fieldErrors.forEach(({ field, message }) => {
    if (knownFields.includes(field as Path<T>)) {
      setError(field as Path<T>, { message });
    }
  });
}
