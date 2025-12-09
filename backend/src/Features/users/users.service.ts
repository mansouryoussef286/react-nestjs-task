import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(dto: CreateUserDto) {
    return this.usersRepo.create({
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash: dto.password,
    });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id: string) {
    return this.usersRepo.findById(id);
  }

  async updateById(id: string, data: any) {
    return this.usersRepo.update({ _id: id }, data);
  }
}
