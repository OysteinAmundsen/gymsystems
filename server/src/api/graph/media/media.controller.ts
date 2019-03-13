import { Controller, Post, UseInterceptors, UploadedFile, Param, UseGuards, Get, Res, Body, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { Role } from '../user/user.model';
import { Media } from './media.model';
import { ApiUseTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer'
import { extname } from 'path'
import * as fs from 'fs';
import * as path from 'path';
import { Log } from '../../common/util/logger/log';
import { UploadDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('media', {
    storage: diskStorage({
      destination: `./media`, // Temporary storage before moving it to it's proper location
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  @UseGuards(RoleGuard(Role.Club))
  uploadMediaForTeamInDiscipline(@UploadedFile() media, @Body() config: UploadDto): Promise<Media> {
    return this.mediaService.save(media, config.clubId, config.teamId, config.disciplineId, config.disciplineName);
  }

  /**
   * Endpoint for retreiving media for a team in a discipline
   *
   * This will return an audio stream, or HTTP 404
   *
   * **USAGE:**
   * GET /media?clubId=&teamId=&disciplineId=&disciplineName=
   *
   */
  @ApiOperation({ title: 'Stream media' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Get()
  async streamMedia(@Res() res, @Query() query: UploadDto) {
    const media = query.id
      ? await this.mediaService.findOneById(query.id)
      : await this.mediaService.findOneBy(query.clubId, query.teamId, query.disciplineId, query.disciplineName);
    if (!media) {
      res.status(404).send('No media found!');
    }

    const filePath = path.resolve(`./media/${media.archiveId}/${media.fileName}`);
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
