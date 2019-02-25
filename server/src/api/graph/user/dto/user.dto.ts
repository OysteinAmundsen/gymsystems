import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { Role } from '../user.model';
import { ClubDto } from '../../club/dto/club.dto';

export class UserDto {
  @ApiModelProperty({ description: 'The Users primary key' })
  id: number;

  @ApiModelProperty({ description: 'The Users full name', example: 'IAmAUser' })
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ description: 'The Users password' })
  password?: string; // Should only be present if this is a user creation

  @ApiModelProperty({ description: 'The Users email address', example: 'user@mail.com' })
  @IsEmail()
  email?: string;

  // @ApiModelPropertyOptional({ description: 'When used as input, this is the Users unencrypted password. Output wont yield this in any response.', example: 'IHaveAPassword' })
  // @IsNotEmpty()
  // password: string;

  @ApiModelProperty({
    description: `An integer categorizing this users authorization level in the system. If this is a new registration,
      the role cannot be higher than 'Club'. If this user is created by another, the role cannot be higher than
      the currently logged on users role.`,
    enum: Role, example: Role.Club, default: Role.User
  })
  @IsInt()
  role: Role;

  @ApiModelProperty({ description: 'The id of an existing club this user belongs to' })
  clubId: number;

  @ApiModelProperty({ description: 'A reference to the club this user belongs to' })
  club?: ClubDto;
}
