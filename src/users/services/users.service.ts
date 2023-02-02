import AppDataSource from '../../db/data-source';
import Users from '../entities/users.entity';
import { Repository } from 'typeorm';
import UserDoesNotExist from '../../common/exceptions/userDoesNotExist.exception';

class UsersService {
  usersRepository: Repository<Users>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(Users);
  }

  public getUsers = async (): Promise<Users[]> => {
    return await this.usersRepository.find();
  };

  public getUserByEmail = async (email: string): Promise<Users> => {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .getOne();
    if (!user) throw new UserDoesNotExist(email);

    return user;
  };

  public updateAvatar = async (email: string, avatarPath: string): Promise<string> => {
    await this.usersRepository
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
