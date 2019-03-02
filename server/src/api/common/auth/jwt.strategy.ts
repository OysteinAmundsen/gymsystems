import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { Config } from '../config';

/**
 * Responsible for deserializing the JWT bearer token and validating the
 * authenticity of the given token. This will determine if the request
 * is authenticated or not.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(private readonly authService: AuthService, config: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET'),
    }, async (payload: JwtPayload, next: Function) => await this.validate(payload, next));
  }

  /**
   * Determines the validity of the token.
   *
   * @param payload The deserialized JWT bearer token
   * @returns a User if this token is valid.
   * @throws UnauthorizedException if the token is invalid
   */
  async validate(payload: JwtPayload, done: Function) {
    const user = await this.authService.validateToken(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
