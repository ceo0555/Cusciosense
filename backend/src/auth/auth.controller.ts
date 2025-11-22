import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  schoolName: string;
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createSuperAdmin(dto);
    return this.authService.login(user.id, user.role);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user.id, user.role);
  }
}
