import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiModelProperty({ description: `The username as previously registerred in the system` })
  username: string;

  @ApiModelProperty({ description: `The unencrypted password as previously registerred in the system` })
  password: string;
}
