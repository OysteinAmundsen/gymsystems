import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, Index, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Team } from '../team/team.model';
import { Discipline } from '../discipline/discipline.model';
import { Tournament } from '../tournament/tournament.model';
import { ApiModelProperty } from '@nestjs/swagger';
import { Club } from '../club/club.model';


/**
 * Media is mainly references to audio files uploaded to
 * the server. Each team is required to supply tournament
 * creators with music scores to accompany the performance
 * of a team during the competition. The NGTF rules state that
 * the music score is to be supplied as either a *.mp3 file or
 * a *.wav file. It is the organizers responsibility to play this
 * music score when the team is to perform.
 *
 * This media file will be autoplayed when the organizer updates a
 * `TeamInDiscipline` with a `startTime`, and is autostopped when the
 * organizer updates a `TeamInDiscipline` with an `endTime`.
 */
@Entity()
export class Media {
  @ApiModelProperty({ description: `The primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `The filename as stored on the server. This will differ from the name of the file uploaded.` })
  @Column('varchar', { length: 100, unique: true })
  fileName: string;

  @ApiModelProperty({ description: `Denotes the subfolder this media is stored in` })
  @Column('varchar', { length: 255 })
  archiveId: string;

  @ApiModelProperty({ description: `The original filename` })
  @Column('varchar', { length: 100 })
  originalName: string;

  @ApiModelProperty({ description: `` })
  @Column('varchar', { length: 50 })
  mimeType: string;

  @ApiModelProperty({ description: `The reference to the discipline this media is to be played under.` })
  @OneToOne(type => Discipline, { nullable: true/*, lazy: true*/ })
  @JoinColumn({ name: 'disciplineId' })
  discipline?: Discipline;

  @Column('int', { nullable: true })
  disciplineId?: number;

  @Column({ nullable: true })
  disciplineName?: string;

  @ApiModelProperty({ description: `The reference to the team this media is to be played under` })
  @OneToOne(type => Team, { nullable: true/*, lazy: true*/ })
  @JoinColumn({ name: 'teamId' })
  team?: Team;

  @Column('int', { nullable: true })
  teamId?: number;

  @ApiModelProperty({ description: `The reference to the tournament this media is to be played under` })
  @ManyToOne(type => Tournament, tournament => tournament.media, { nullable: true/*, lazy: true*/ })
  @JoinColumn({ name: 'tournamentId' })
  tournament?: Tournament;

  @Column('int', { nullable: true })
  tournamentId?: number;

  @Column('int')
  clubId: number;

  @ApiModelProperty({ description: `The reference to the club this media is uploaded by` })
  @ManyToOne(type => Club, club => club.media, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club: Club
}
