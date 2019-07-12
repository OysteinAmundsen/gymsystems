import { Module, NestModule, MiddlewareConsumer, RequestMethod, Inject } from '@nestjs/common';
import { GraphQLModule, GqlModuleOptions, GraphQLFactory } from '@nestjs/graphql';

import { join } from 'path';
import { Config } from './common/config';

import { CommonModule } from './common/common.module';
import { AdministrationModule } from './rest/administration/administration.module';
import { DisplayModule } from './rest/display/display.module';

import { ClubModule } from './graph/club/club.module';
import { DisciplineModule } from './graph/discipline/discipline.module';
import { DivisionModule } from './graph/division/division.module';
import { GymnastModule } from './graph/gymnast/gymnast.module';
import { JudgeModule } from './graph/judge/judge.module';
import { MediaModule } from './graph/media/media.module';
import { ScoreModule } from './graph/score/score.module';
import { ScoreGroupModule } from './graph/score-group/score-group.module';
import { TeamModule } from './graph/team/team.module';
import { ScheduleModule } from './graph/schedule/schedule.module';
import { TournamentModule } from './graph/tournament/tournament.module';
import { TroopModule } from './graph/troop/troop.module';
import { UserModule } from './graph/user/user.module';
import { VenueModule } from './graph/venue/venue.module';
import { JudgeInScoreGroupModule } from './graph/judge-in-score-group/judge-in-score-group.module';

import { AppController } from './app.controller';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { Log } from './common/util/logger/log';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [CommonModule],
      useFactory: async (config: Config) => {
        return <GqlModuleOptions>{
          typePaths: ['./**/*.graphql'],
          debug: !config.isProd(),
          tracing: !config.isProd(),
          playground: !config.isProd(),
          installSubscriptionHandlers: true,
          path: `/${Config.GlobalRoutePrefix}${Config.GraphRoute}`,
          addTypename: false,
          subscriptions: {
            path: `/${Config.GlobalRoutePrefix}${Config.SubscribeRoute}`
          },
          definitions: {
            path: join(__dirname, `./graph/graphql.schema.ts`),
            outputAs: 'class'
          },
          context: ({ req }) => ({ req })
        }
      },
      inject: [Config]
    }),
    CommonModule,

    AdministrationModule,
    DisplayModule,

    ClubModule,
    DivisionModule,
    DisciplineModule,
    GymnastModule,
    JudgeModule,
    JudgeInScoreGroupModule,
    MediaModule,
    ScheduleModule,
    ScoreModule,
    ScoreGroupModule,
    TeamModule,
    TournamentModule,
    TroopModule,
    UserModule,
    VenueModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  constructor() {
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
