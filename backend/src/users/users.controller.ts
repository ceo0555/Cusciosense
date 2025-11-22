import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles, RolesGuard } from "@/common/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("admins")
  @Roles("SUPER_ADMIN")
  listAdmins() {
    return this.usersService.listAdmins();
  }
}
