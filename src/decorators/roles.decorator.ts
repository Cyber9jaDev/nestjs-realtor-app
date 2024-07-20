import { SetMetadata } from "@nestjs/common";
import { UserType } from "@prisma/client";

// The setMetadata takes a key-value pair as parameters
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);