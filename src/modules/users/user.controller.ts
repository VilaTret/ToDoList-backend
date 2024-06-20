import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  getProfile(@Param('id') id: string): Promise<ProfileUserDto> {
    return this.userService.getProfile(id);
  }

  @Get('all-profiles')
  getAllProfiles(): Promise<ProfileUserDto[]> {
    return this.userService.getAllProfiles();
  }

  @Post('update/:id')
  update(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ): Promise<ProfileUserDto> {
    return this.userService.update(id, userDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<string> {
    return this.userService.delete(id);
  }
}
