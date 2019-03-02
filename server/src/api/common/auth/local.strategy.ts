import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../graph/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    },
      async (username: string, password: string, next: Function) => await this.validate(username, password, next));
  }

  /**
   * Determines the validity of the given username and password.
   *
   * @param username The username
   * @param password The password
   * @returns a User if a match is found in persistance layer
   * @throws UnauthorizedException if the no user can be found
   */
  async validate(username: string, password: string, done: Function) {
    const user = await this.userService.findOneByUsername(username);
    if (!user || !this.userService.isPasswordCorrect(user, password)) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
