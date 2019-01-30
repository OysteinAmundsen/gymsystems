import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { TimeSpan } from '../tournament.model';
import { VenueDto } from 'api/graph/venue/dto/venue.dto';
import { ClubDto } from 'api/graph/club/dto/club.dto';

export class TournamentDto {
  @ApiModelProperty({ description: `The tournament primary key` })
  id: number;

  @ApiModelProperty({ description: `The tournaments unique string identifier. Also the header everywhere tournament data is presented.` })
  name: string;

  @ApiModelPropertyOptional({ description: `Norwegian description in markdown` })
  description_no?: string;

  @ApiModelPropertyOptional({ description: `English description in markdown` })
  description_en?: string;

  @ApiModelProperty({ description: `The date for the first day of the event` })
  startDate?: Date;

  @ApiModelProperty({ description: `The date for the last day of the event` })
  endDate?: Date;

  @ApiModelPropertyOptional({ description: `An array of timespans, describing the start and end time for each day in the event.` })
  times?: TimeSpan[];

  venue?: VenueDto;

  @ApiModelProperty({ description: `An object specifying the location of the event.` })
  venueId?: number;

  @ApiModelProperty({ description: `This field is automatically created when a user creates a newevent.` })
  createdById?: number;

  club?: ClubDto;

  @ApiModelProperty({ description: `A reference to the club this tournament is hosted by` })
  clubId?: number;

  // LODGING -----------------------------------------------------
  @ApiModelProperty({ description: `The number of gymnasts this tournament can be able to provide lodging for.` })
  providesLodging: boolean;

  @ApiModelPropertyOptional({
    description: `The price for lodging per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  lodingCostPerHead?: number;

  // TRANSPORT ---------------------------------------------------
  @ApiModelProperty({ description: `If true, this tournament can provide transportation for traveling gymnasts.` })
  providesTransport: boolean;

  @ApiModelPropertyOptional({
    description: `The price for transportation per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  transportationCostPerHead?: number;

  // BANQUET -----------------------------------------------------
  @ApiModelProperty({ description: `If true, this tournament will throw a banquet in honor of the performing gymnasts.` })
  providesBanquet: boolean;

  @ApiModelPropertyOptional({
    description: `The price for the banquet per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  banquetCostPerHead?: number;
}
