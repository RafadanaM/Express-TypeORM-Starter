import AppDataSource from '../../data-source';
import Users from './users.entity';
import { Repository } from 'typeorm';
import BaseService from '../../interfaces/baseService.interface';

class UsersService implements BaseService {
  baseRepository: Repository<Users>;

  constructor() {
    this.baseRepository = AppDataSource.getRepository(Users);
  }

  public getUsers = async (): Promise<Users[]> => {
    return await this.baseRepository.find();
  };

  public updateAvatar = async (email: string, avatarPath: string) => {
    await this.baseRepository
      .createQueryBuilder('users')
      .update()
      .set({
        avatar: avatarPath,
      })
      .where('users.email = :email', { email: email })
      .execute();
    return avatarPath;
  };
}

export default UsersService;
