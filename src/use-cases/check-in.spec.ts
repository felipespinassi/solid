import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-respository";
import { CheckinUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    vi.useFakeTimers();

    gymsRepository.items.push({
      id: "gym-01",
      title: "Javascript  Gym",
      description: "The best gym to learn javascript",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: "",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.7803867,
      userLongitude: -48.8296814,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.7803867,
      userLongitude: -48.8296814,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -21.7803867,
        userLongitude: -48.8296814,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should  be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.7803867,
      userLongitude: -48.8296814,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -21.7803867,
      userLongitude: -48.8296814,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });
});
