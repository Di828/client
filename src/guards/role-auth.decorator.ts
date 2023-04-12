import { SetMetadata } from "@nestjs/common";

//Ключ для получения метаданных внутри role-guard
export const ROLES_KEY = 'roles';

//Прокидываем роли, для получения доступа к ним внутри гварда
export const Roles = (...roles : string[]) => SetMetadata(ROLES_KEY, roles);