import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUsersDto): Promise<User> {
    const { Password, ...rest } = createUserDto;
    const hashedPassword = await this.hashPassword(Password);
    const newUser = this.userRepository.create({
      ...rest,
      Password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'UserID',
        'FirstName',
        'LastName',
        'Phone',
        'Photo',
        'Role',
        'Username',
        'Email',
        'createdAt',
      ],
      withDeleted: false,
    });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { UserID: id },
      withDeleted: false,
      select: [
        'UserID',
        'FirstName',
        'LastName',
        'Phone',
        'Photo',
        'Role',
        'Username',
        'Email',
        'createdAt',
      ],
    });
  }

  async findByLogin(login: string) {
    return this.userRepository.findOne({
      where: [{ Username: login }, { Email: login }],
      withDeleted: false,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update({ UserID: id }, updateUserDto);
    const updatedUser = await this.userRepository.findOne({
      where: { UserID: id },
      select: ['UserID', 'FirstName', 'LastName', 'Phone', 'Photo', 'Role'],
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

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(15);
    return bcrypt.hash(password, salt);
  }
}
