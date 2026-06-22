export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(statusCode: number, data: T | null, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
