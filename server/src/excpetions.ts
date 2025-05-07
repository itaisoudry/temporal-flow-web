export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {}
