import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionResolver } from './division.resolver';
import { DivisionService } from './division.service';
import { TeamModule } from '../team/team.module';
import { Division } from './division.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division]),
    forwardRef(() => TeamModule)
  ],
  providers: [DivisionResolver, DivisionService],
  exports: [DivisionService]
})
export class DivisionModule { }


