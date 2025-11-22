import { Role } from "@/store/session-store";

type Ability = {
  action: string;
  subject: string;
};

const policy: Record<Role, Ability[]> = {
  SUPER_ADMIN: [
    { action: "manage", subject: "all" },
    { action: "impersonate", subject: "users" },
  ],
  SCHOOL_ADMIN: [
    { action: "manage", subject: "school" },
    { action: "manage", subject: "classes" },
    { action: "read", subject: "finance" },
  ],
  TEACHER: [
    { action: "manage", subject: "homework" },
    { action: "manage", subject: "attendance" },
    { action: "read", subject: "students" },
  ],
  STUDENT: [
    { action: "read", subject: "courses" },
    { action: "submit", subject: "homework" },
  ],
  PARENT: [
    { action: "read", subject: "children" },
    { action: "pay", subject: "fees" },
  ],
};

export function can(role: Role, action: string, subject: string) {
  const abilities = policy[role] ?? [];
  return (
    abilities.some(
      (ability) =>
        (ability.action === action || ability.action === "manage") &&
        (ability.subject === subject || ability.subject === "all")
    ) || role === "SUPER_ADMIN"
  );
}
