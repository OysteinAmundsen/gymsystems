import { Get, Controller } from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Log } from './common/util/logger/log';
const pkg = require('api/../../package.json');

@ApiUseTags('root')
@Controller()
export class AppController {
  constructor() {
  }

  @ApiOperation({ title: 'Root of api', description: 'Just fetches the name and version' })
  @ApiResponse({ status: 200, description: 'If the server is up and running' })
  @Get()
  root(): any {
    return {
      name: pkg.name,
      version: pkg.version
    };
  }
}
