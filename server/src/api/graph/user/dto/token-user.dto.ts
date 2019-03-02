import { ApiModelProperty } from '@nestjs/swagger';
import { Role } from '../user.model';

export class TokenUserDto {
  id: number;

  @ApiModelProperty({ description: `The username as previously registerred in the system` })
  name: string;

  @ApiModelProperty({ description: `The users email address` })
  email: string;

  role?: Role;

  clubId?: number;
}
