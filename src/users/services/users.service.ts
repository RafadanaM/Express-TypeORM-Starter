import NotFoundException from "../../common/exceptions/notFound.exception";
import AppDataSource from "../../../db/data-source";
import Users from "../entities/users.entity";
import { Repository } from "typeorm";

class UsersService {
  usersRepository: Repository<Users>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(Users);
  }

  public async getUsers(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  public async getUserById(userId: string): Promise<Users> {
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .where("users.id = :id", { id: userId })
      .getOne();
    if (!user) throw new NotFoundException("User does not exists");

    return user;
  }

  public async updateAvatar(email: string, avatarPath: string): Promise<string> {
    await this.usersRepository
      .createQueryBuilder("users")
      .update()
      .set({
        avatar: avatarPath,
      })
      .where("users.email = :email", { email: email })
      .execute();
    return avatarPath;
  }
}

export default UsersService;
