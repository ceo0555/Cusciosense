import { Injectable } from "@nestjs/common";
import { DatabaseService } from "@/database/database.service";
import * as argon from "argon2";

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async createSuperAdmin(dto: { schoolName: string; email: string; password: string }) {
    const passwordHash = await argon.hash(dto.password);
    return this.db.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: "SUPER_ADMIN",
        profile: {
          create: {
            displayName: dto.schoolName,
          },
        },
      },
    });
  }

  listAdmins() {
    return this.db.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "SCHOOL_ADMIN"] } },
      select: { id: true, email: true, role: true },
    });
  }
}
