import { ApiModelProperty } from '@nestjs/swagger';
import { Classes } from '../team.model';

export class TeamDto {
  @ApiModelProperty({ description: `The Team primary key` })
  id: number;

  @ApiModelProperty({
    description: `A unique name for this team.
      The name is inherited from the 'Troop' which originally defined
      the team layout, but it can be changed.`,
    example: 'Haugesund-jr-1'
  })
  name: string;

  @ApiModelProperty({ description: `The team must be competing in either 'National classes' or 'Teamgym'.`, default: Classes.National })
  class: Classes;

  @ApiModelProperty({ description: `The 'Club' which created and is responsible for this troop.` })
  clubId: number;

  @ApiModelProperty({ description: `The tournament this team is to compete in.` })
  tournamentId: number;
}
