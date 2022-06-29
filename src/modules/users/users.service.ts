import AppDataSource from '../../data-source';
import logger from '../../logger/logger';
import Users from './users.entity';
import { Repository } from 'typeorm';

class UsersService {
  private userRepository: Repository<Users>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(Users);
  }

  public getUsers = async (): Promise<Users[]> => {
    logger.info('oi');

    return await this.userRepository.find();
  };
}

export default UsersService;
