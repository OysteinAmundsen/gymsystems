import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserService } from '../../graph/user/user.service';
import { Config } from '../config';
import { User } from '../../graph/user/user.model';
import { TokenUserDto } from '../../graph/user/dto/token-user.dto';
import { Response } from 'express';

/**
 *
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly config: Config,
    private readonly jwtService: JwtService) { }

  signOut(req): any {
    req.logout();
  }

  signIn(res: Response, user: User): TokenUserDto {
    const token = this.createToken(user);
    res.set('Authorization', token.accessToken);
    res.set('expiresIn', '' + token.expiresIn);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clubId: user.clubId
    }
  }

  /**
   * Used during login, this creates a JWT bearer token for this user.
   *
   * @returns a token if the user credentials are verified
   */
  createToken(user: User) {
    const expiresIn = this.config.get('JWT_EXPIRATION') || 3600;
    const accessToken = this.jwtService.sign({
      // These properties will be encoded into the token
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clubId: user.clubId
    }, { expiresIn: expiresIn });
    return { expiresIn, accessToken };
  }

  /**
   *
   * @param payload The deserialized JWT bearer token
   */
  async validateToken(payload: JwtPayload): Promise<User> {
    return await this.usersService.findOneById(payload.id);
  }
}
