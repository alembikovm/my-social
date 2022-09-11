import { Role } from './role.enum';

export interface UserEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
