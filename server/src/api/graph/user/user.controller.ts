import { Controller, Get, Param, NotFoundException, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, Delete, BadRequestException, Put, ForbiddenException, UnauthorizedException, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../common/auth/auth.service';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';
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

  @ApiOperation({ title: 'Log out a user' })
  @Post('/logout')
  logout(@Req() req) {
    this.authService.signOut(req);
  }

  @ApiOperation({ title: 'Creates a user', description: 'Self service registration of a new user' })
  @ApiResponse({ status: 400, description: 'If the given user object fails to validate' })
  @ApiResponse({ status: 403, description: `If the given users role is a higher rank than the currently logged on user, or if your rank is not that of a club representative or higher` })
  @Post()
  async createUser(@Body() user: UserDto): Promise<User> {
    return await this.userService.save(<User>user);
  }

  @ApiOperation({ title: 'Find a user with a specific id.' })
  @ApiResponse({ status: 403, description: 'If logged in user does not have the privilege of fetching data for this user.' })
  @ApiResponse({ status: 404, description: 'If the user with this id cannot be found' })
  @ApiImplicitParam({ name: 'id', type: 'string', description: 'The :id can here also be "me" to get details about the currently logged on user' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const me = await this.userService.getAuthenticatedUser();
    if (id === 'me') {
      return me;
    } else if (!me) {
      throw new ForbiddenException('Not authorized to query users');
    }

    const user = (await this.userService.findOneById(parseInt(id, 10)));
    if (!user) {
      throw new NotFoundException(`No user found with id ${id}`);
    }
    return user;
  }

  @ApiOperation({ title: 'Patch properties for a user with a specific id.' })
  @ApiResponse({ status: 401, description: 'If no valid JWT token exists in the header' })
  @ApiResponse({ status: 403, description: 'If the user requesting this update does not have privileges to edit the given user' })
  @ApiResponse({ status: 404, description: 'If the user with this id cannot be found' })
  @ApiImplicitParam({ name: 'id', type: 'string', description: 'The :id can here also be "me" to get details about the currently logged on user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() changes: UserDto): Promise<UserDto> {
    return this.userService.save(changes);
  }
}
