class HttpException extends Error {
  status: number;

  message: string;

  error?: unknown | null;

  constructor(status: number, message: string, error: unknown | null = null) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export default HttpException;
