import { ApiModelProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class VenueDto {
  @ApiModelProperty({ description: `` })
  id: number;

  @ApiModelProperty({ description: `` })
  name: string;

  @ApiModelProperty({ description: `` })
  address: string;

  @ApiModelProperty({ description: `` })
  longitude?: string;

  @ApiModelProperty({ description: `` })
  latitude?: string;

  @ApiModelProperty({ description: `` })
  rentalCose?: number;

  @ApiModelProperty({ description: `` })
  contact?: string;

  @ApiModelProperty({ description: `` })
  contactPhone?: string;

  @ApiModelProperty({ description: `` })
  contactEmail?: string;

  @ApiModelProperty({ description: `` })
  capacity?: number;

  @ApiModelProperty({ description: `The user which has established contact with this venue` })
  createdBy: UserDto;
}
