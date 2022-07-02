import AppDataSource from '../../data-source';
import logger from '../../logger/logger';
import Users from './users.entity';
import { Repository } from 'typeorm';
import BaseService from '../../interfaces/baseService.interface';

class UsersService implements BaseService {
  baseRepository: Repository<Users>;

  constructor() {
    this.baseRepository = AppDataSource.getRepository(Users);
  }

  public getUsers = async (): Promise<Users[]> => {
    logger.info('oi');

    return await this.baseRepository.find();
  };
}

export default UsersService;
