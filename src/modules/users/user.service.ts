import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({ ...userDto });
    return await this.userRepository.save(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async getProfile(id: string): Promise<ProfileUserDto> {
    return await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'name', 'email'],
    });
  }

  async getAllProfiles(): Promise<ProfileUserDto[]> {
    return await this.userRepository.find({ select: ['id', 'name', 'email'] });
  }

  async update(id: string, userDto: UpdateUserDto): Promise<ProfileUserDto> {
    await this.userRepository.update({ id: id }, { ...userDto });
    return this.getProfile(id);
  }

  async delete(id: string): Promise<string> {
    await this.userRepository.delete({ id: id });
    return id;
  }
}
