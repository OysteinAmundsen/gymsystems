import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, Param, UseGuards, Get, Res } from '@nestjs/common';
import { MediaService } from './media.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { Role } from '../user/user.model';
import { Media } from './media.model';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer'
import { extname } from 'path'
import * as fs from 'fs';
import * as path from 'path';
import { Log } from '../../common/util/logger/log';

/**
 * RESTful controller for all things related to `Media`s.
 */
@ApiUseTags('media')
@Controller('media')
export class MediaController {

  constructor(private readonly mediaService: MediaService) { }

  /**
   * Endpoint for uploading media for a team in a discipline
   */
  @ApiOperation({ title: 'Upload media for a particular team to be played in a given discipline' })
  @ApiBearerAuth()
  @Post('upload/:teamId/:disciplineId')
  @UseInterceptors(FileInterceptor('media', {
    storage: diskStorage({
      destination: `./media`,
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  @UseGuards(RoleGuard(Role.Club))
  uploadMediaForTeamInDiscipline(@UploadedFile() media, @Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number): Promise<Media> {
    return this.mediaService.save(teamId, disciplineId, media);
  }

  /**
   * Endpoint for retreiving media for a team in a discipline
   *
   * This will return an audio stream, or HTTP 404
   *
   * **USAGE:**
   * GET /media/:teamId/:disciplineId
   *
   */
  @Get(':teamId/:disciplineId')
  async streamMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res) {
    const media = await this.mediaService.findByTeamAndDiscipline(teamId, disciplineId);
    if (!media) {
      res.status(404).send('No media found!');
    }

    const filePath = path.resolve(`./media/${media.tournamentId}/${media.fileName}`); // D:\dev\gymsystems\server\media\3\bbbf3557b4ab7bb67047cf7fb2297bb7.mp3
    try {
      const stat = fs.statSync(filePath);
      Log.log.info(`Streaming '${media.fileName}' : ${stat.size}`);
      res.writeHead(200, {
        'Content-Type': media.mimeType,
        'Content-Length': stat.size
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (ex) {
      await this.mediaService.remove(media.id);
      res.status(404).send('No media found!');
    }
  }
}
