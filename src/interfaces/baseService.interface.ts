import { ObjectLiteral, Repository } from 'typeorm';

interface BaseService {
  baseRepository: Repository<ObjectLiteral>;
}

export default BaseService;
