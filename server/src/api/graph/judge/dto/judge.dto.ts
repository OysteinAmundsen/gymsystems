import { JudgeInScoreGroupDto } from '../../judge-in-score-group/dto/judge-in-score-group.dto';

export class JudgeDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  allergies?: string;
  scoreGroups?: JudgeInScoreGroupDto[];
}
