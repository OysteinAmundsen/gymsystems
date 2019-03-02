import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../common/auth/auth.service';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenUserDto } from './dto/token-user.dto';

@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService) { }

  @ApiOperation({ title: 'Authenticate a user' })
  @ApiResponse({ status: 403, description: 'If the credentials given is not valid' })
  @ApiBearerAuth()
  @Post('/login')
  @UseGuards(AuthGuard('local')) // <-- Takes care of user/password validation
  async login(@Res() res, @Body() credentials: LoginUserDto): Promise<TokenUserDto> {
    const user = await this.userService.findOneByUsername(credentials.username);
    return res.send(this.authService.signIn(res, user));
  }
}
