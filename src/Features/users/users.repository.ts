import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findOne(filter: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(
    filter: FilterQuery<User>,
    data: Partial<User>,
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  async delete(filter: FilterQuery<User>): Promise<boolean> {
    const res = await this.userModel.deleteOne(filter).exec();
    return res.deletedCount > 0;
  }
}
