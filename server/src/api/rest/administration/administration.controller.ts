import { Controller, Get, Res, BadRequestException, Post, UseInterceptors, UploadedFile, Param, UseGuards, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiImplicitFile, ApiImplicitParam, ApiImplicitBody } from '@nestjs/swagger';
import { Response } from 'express-serve-static-core';
import { resolve } from 'path';

import { RoleGuard } from '../../common/auth/role.guard';
import { Configuration } from './configuration.model';
import { Role } from '../../graph/user/user.model';

import { ExportService } from './export.service';
import { ConfigurationService } from './configuration.service';
import { Log } from '../../common/util/logger/log';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiUseTags('Administration')
@Controller('administration')
export class AdministrationController {

  constructor(private readonly exportService: ExportService, private readonly configuration: ConfigurationService) {
  }

  @ApiOperation({ title: 'Export the entire database', description: 'This is a security measure to avoid data-loss.' })
  @ApiResponse({ status: 400, description: 'If the server was unable to export' })
  @ApiResponse({ status: 401, description: 'If no jwt token exists' })
  @ApiResponse({ status: 403, description: 'If the logged on user does not have the privileges to export' })
  @ApiBearerAuth()
  @Get('/backup')
  async backup(@Res() res: Response) {
    const dump = await this.exportService.dumpDb();
    if (!dump) {
      throw new BadRequestException('Could not process database dump');
    }
    return res.status(200)
      .attachment('dbdump.sql')
      .sendFile(resolve('./dbdump.sql'));
  }

  @ApiOperation({ title: 'Import database', description: 'This is a non-destructive import, which means it will not overwrite existing data.' })
  @ApiResponse({ status: 400, description: 'If the server was unable to import' })
  @ApiResponse({ status: 401, description: 'If no jwt token exists' })
  @ApiResponse({ status: 403, description: 'If the logged on user does not have the privileges to import' })
  @ApiImplicitFile({ name: 'file', description: 'The backup file to restore' })
  @ApiBearerAuth()
  @Post('/restore')
  @UseInterceptors(FileInterceptor('file'))
  async restore(@UploadedFile() file) {
    // TODO: Requires implementation
  }

  @ApiOperation({ title: 'Retreive all configuration in the system' })
  @Get('configuration')
  allConfig(): Promise<Configuration[]> {
    return this.configuration.getAll();
  }

  @ApiOperation({ title: 'retreiving a configuration value based on a given key' })
  @ApiImplicitParam({ name: 'id', description: 'the key of the configuration entry to fetch' })
  @Get('configuration/:id')
  getConfig(@Param('id') id: string): Promise<Configuration> {
    return this.configuration.getOneById(id);
  }

  @ApiOperation({ title: 'creating a new configuration value' })
  @ApiImplicitBody({ name: 'configuration', type: Configuration, description: 'the configuration object to persist' })
  @ApiBearerAuth()
  @Post('configuration')
  @UseGuards(RoleGuard(Role.Admin))
  saveConfig(@Body() configuration: Configuration[]): Promise<Configuration[]> {
    return this.configuration.saveAll(configuration);
  }

  @ApiOperation({ title: 'updating a configuration value based on a given key' })
  @ApiImplicitParam({ name: 'id', description: 'the key of the configuration object to persist' })
  @ApiImplicitBody({ name: 'configuration', type: Configuration, description: 'the configuration object to persist' })
  @Put('configuration/:id')
  @UseGuards(RoleGuard(Role.Admin))
  updateConfig(@Param('id') id: string, @Body() configuration: Configuration): Promise<Configuration> {
    return this.configuration.save(configuration);
  }

  @ApiOperation({ title: 'removing a configuration value' })
  @ApiImplicitParam({ name: 'id', description: 'the key of the configuration object to delete' })
  @Delete('configuration/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async remove(@Param('id') id: string) {
    return this.configuration.remove(id);
  }
}
