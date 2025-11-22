import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@/users/users.service";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const passwordValid = await argon.verify(user.passwordHash, password);
    if (!passwordValid) throw new UnauthorizedException("Invalid credentials");

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "7d",
      }),
    };
  }
}
