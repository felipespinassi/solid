export class userAlreadyExistsError extends Error {
  constructor() {
    super("User with same email already exists");
  }
}
