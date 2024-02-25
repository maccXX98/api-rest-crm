import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUsersDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: false });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { UserID: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update({ UserID: id }, updateUserDto);
    const updatedUser = await this.userRepository.findOne({
      where: { UserID: id },
    });
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.userRepository.softDelete({
      UserID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
}
