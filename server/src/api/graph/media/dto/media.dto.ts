import { ApiModelProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiModelProperty({ description: `The primary key` })
  id: number;

  @ApiModelProperty({
    description: `The filename as stored on the server.
      This will differ from the name of the file uploaded. After upload, the media is available under

      'media/{tournament.id}/{team.name}_{team.divisionName}_{discipline.name}.{extension}'`
  })
  fileName: string;

  @ApiModelProperty({ description: `The original filename` })
  originalName: string;

  @ApiModelProperty({ description: `` })
  mimeType: string;

  @ApiModelProperty({ description: `The reference to the discipline this media is to be playedunder.` })
  discipline: { id: number };

  @ApiModelProperty({ description: `The reference to the team this media is to be played under` })
  team: { id: number };

  @ApiModelProperty({ description: `The reference to the tournament this media is to be played under` })
  tournament: { id: number };
}
