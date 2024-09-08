import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Felipe",
      email: "felipe_spinassi@hotmail.com",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("Felipe");
  });

  it("should not be able to get user with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "wrong-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
