import { Module, forwardRef } from '@nestjs/common';
import { TroopService } from './troop.service';
import { TroopResolver } from './troop.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Troop } from './troop.model';
import { GymnastModule } from '../gymnast/gymnast.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Troop]),
    forwardRef(() => GymnastModule)
  ],
  providers: [TroopService, TroopResolver],
  exports: [TroopService]
})
export class TroopModule { }
