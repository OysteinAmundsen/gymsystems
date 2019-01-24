import { Controller, Get, Param } from '@nestjs/common';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { VenueService } from './venue.service';
import { LocationDto } from './dto/location.dto';
import { AxiosResponse } from 'axios';
import { Log } from 'api/common/util/logger/log';

@ApiUseTags('venue')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) { }

  /**
   * Just because I could not get this to relay properly using graphql
   */
  @ApiOperation({ title: 'Lookup a geolocation' })
  @Get('/location/:address')
  location(@Param('address') address: string): Promise<AxiosResponse<LocationDto[]>> {
    return this.venueService.findLocationByAddress(address).then((res: any) => {
      Log.log.debug(res.data);
      return res.data;
    });
  }

}
