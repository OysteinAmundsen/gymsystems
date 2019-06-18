import { Controller, Post, Param, Req, Get, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { snakeCase } from 'lodash';
import fs from 'fs';
import * as moment from 'moment';
import * as csv from 'fast-csv';

import { Role, Gymnast } from '..';
import { ExportService, exportDelimeter } from '../../rest/administration/export.service';
import { Log } from '../../common/util/logger/log';
import { RoleGuard } from '../../common/auth/role.guard';
import { ClubService } from './club.service';
import { GymnastService } from '../gymnast/gymnast.service';

@Controller('club')
export class ClubController {

  constructor(
    private readonly clubService: ClubService,
    private readonly gymnastService: GymnastService,
    private readonly exportService: ExportService
  ) { }

  /**
   * Endpoint for importing members to a club
   * This will make sure not to add existing members, but it will rewrite data for existing members.
   *
   * **USAGE:** (Club only)
   * POST /clubs/:clubId/import-members
   *
   */
  @Post('/:clubId/import-members')
  @UseGuards(RoleGuard(Role.Club))
  @UseInterceptors(FileInterceptor('members', { dest: `/tmp` }))
  async importMembers(@Param('clubId') clubId: number, @UploadedFile() file): Promise<Gymnast[]> {
    return new Promise(async (resolve, reject) => {
      const members: Gymnast[] = [];
      ClubService.enforceSame(clubId);

      const existingMembers: Gymnast[] = await this.gymnastService.findByClubId(clubId);

      fs.createReadStream(file.path)
        .pipe(csv.parse({ delimiter: exportDelimeter, ignoreEmpty: true, trim: true, headers: true }))
        .on('data', (data: any) => {
          // TODO: This will overwrite data. We should validate
          const find = (key: string) => data[Object.keys(data).find((k: string) => k.toLowerCase().indexOf(key.toLowerCase()) > -1)];
          const name = find('name');
          const member = existingMembers.find(g => g.name === name) || <Gymnast>{};
          members.push(<Gymnast>Object.assign(member, {
            id: member.id || null,
            name: name,
            birthYear: find('year'),
            birthDate: member.birthDate || null,
            email: find('email'),
            phone: find('phone'),
            gender: ['m', 'male', 'herre', 'herrer', 'gutt', 'boy', '1', 1].indexOf(find('gender').toLowerCase()) > -1 ? 1 : 2,
            allergies: find('allergies'),
            guardian1: find('guardian1'),
            guardian2: find('guardian2'),
            guardian1Phone: find('guardian1Phone'),
            guardian2Phone: find('guardian2Phone'),
            guardian1Email: find('guardian1Email'),
            guardian2Email: find('guardian2Email'),
            troop: member.troop || null,
            team: member.team || null,
            clubId: clubId,
            lodging: member.lodging || null,
            transport: member.team || null,
            banquet: member.banquet || null
          }));
        })
        .on('end', async () => {
          // Cleanup removing uploaded file
          fs.unlink(file.path, (err: any) => {
            if (err) { Log.log.error(`Error importing members to club ${clubId}`, err); }
          });

          // Persist data
          const results = await this.gymnastService.saveAll(members);
          resolve(results);
        })
        .on('error', (err: any) => {
          Log.log.error(`Error reading in memberdata from file to club ${clubId}`, err);
          reject(err);
        });
    });
  }

  /**
   * Endpoint for exporting members to a club
   *
   * **USAGE:** (Club only)
   * POST /clubs/:clubId/export-members
   *
   */
  @Get('/:clubId/export-members')
  @UseGuards(RoleGuard(Role.Club))
  async exportMembers(@Param('clubId') clubId: number, @Res() res) {
    ClubService.enforceSame(clubId);

    const club = await this.clubService.findOneById(clubId);
    const members: Gymnast[] = await this.gymnastService.findByClubId(clubId);
    const data = this.exportService.writeCSVExport({ data: members });
    res.charset = 'utf-8';
    res.status(200)
      .attachment(`${snakeCase(club.name)}.members.export_${moment().format('YYYY.MM.DD')}.csv`)
      .contentType('text/csv')
      .send(data);
  }
}
