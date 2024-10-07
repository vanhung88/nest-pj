import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/users')
  async getAllUser() {
    const user = await this.userService.find();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get('/user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Delete('/user/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.remove(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch('/user/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }
}
