import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: Types.ObjectId;
  username: string;
  roles: Role[];
}
