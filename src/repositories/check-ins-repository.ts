<<<<<<< HEAD
import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
}
=======
import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
}
>>>>>>> 864bce470c8a3cffd6a56743eb7d87d2ad031279
