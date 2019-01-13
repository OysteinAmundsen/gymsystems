import { Module, Global, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { UserModule } from '../graph/user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { Config } from './config';
import { LocalStrategy } from './auth/local.strategy';
import { DateScalar } from './scalars/date.scalar';
import { OrmLog } from './util/logger/orm-log';
import { getConnectionOptions } from 'typeorm';
import { LogService } from './util/logger/log.service';


export const pubSub = new PubSub();

/**
 * Global module containing the configuration
 */
@Global()
@Module({
  imports: [
    // Database configuration
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const config = await getConnectionOptions('default');
        return Object.assign(config, {
          logger: new OrmLog('all')
        })
      }
    }),

    // Authentication configuration
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [CommonModule], // Circular dependency, but this is async so it will resolve after this module is created
      useFactory: async (config: Config) => ({
        secretOrPrivateKey: config.get('SECRET'),
        signOptions: { expiresIn: 3600 }
      }),
      inject: [Config]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    Config,
    DateScalar,
    { provide: 'PubSubInstance', useValue: pubSub },
    LogService
  ],
  exports: [AuthService, JwtStrategy, LocalStrategy, Config, 'PubSubInstance', LogService]
})
export class CommonModule { }
