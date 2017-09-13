import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, Index, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Team } from './Team';
import { Discipline } from './Discipline';
import { Division, DivisionType } from './Division';
import { Tournament } from './Tournament';

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
 *
 * @export
 * @class Media
 */
@Entity()
export class Media {
  /**
   * The Gymnast primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The filename as stored on the server.
   * This will differ from the name of the file uploaded.
   *
   * After upload, the media is available under
   * `media/{tournament.id}/{team.name}_{team.divisionName}_{discipline.name}.mp3`
   */
  @Column({ length: 100, unique: true })
  filename: string;

  /**
   * The reference to the discipline this media is to be played
   * under.
   */
  @OneToOne(type => Discipline, { nullable: false })
  @JoinColumn({name: 'discipline' })
  discipline: Discipline;

  /**
   * The reference to the team this media is to be played under
   */
  @OneToOne(type => Team, { nullable: false, cascadeInsert: false, cascadeUpdate: false })
  @JoinColumn({name: 'team'})
  team: Team;

  /**
   * The reference to the tournament this media is to be played under
   */
  @ManyToOne(type => Tournament, tournament => tournament.media, { nullable: false })
  tournament: Tournament;

  /**
   * Convenient way to present a human readable version of the
   * `Division`
   */
  get division(): string {
    const ageDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision(this.team).name} ${ageDivision(this.team).name}`;
  }
}
