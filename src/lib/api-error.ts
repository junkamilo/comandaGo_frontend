import type { FieldErrorResponse } from "@/lib/types/api-response";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrorResponse[];

  constructor(status: number, message: string, fieldErrors?: FieldErrorResponse[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
