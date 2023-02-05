import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { remove, select } from '../../common/utils/entity.util';

@Entity()
class Users {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public first_name!: string;

  @Column()
  public last_name!: string;

  @Column({ unique: true })
  public email!: string;

  @Column({ select: false })
  public password!: string;

  @Column()
  public birth_date!: Date;

  @Column({ nullable: true, default: null })
  public avatar!: string;

  @CreateDateColumn()
  public created!: Date;

  @UpdateDateColumn()
  public updated!: Date;

  /**
   * select properties of an Users by its keys
   * @param {U extends keyof Users} keys keys of Users
   * @returns {Pick<Users, U>} Users with only the selected properties
   */
  public select<U extends keyof Users>(...keys: U[]): Pick<Users, U> {
    return select(this, ...keys);
  }

  /**
   * remove properties of an Users by its keys
   * @param {U extends keyof Users} keys keys of Users
   * @returns {Omit<Users, U>} Users without the removed properties
   */
  public remove<U extends keyof Users>(...keys: U[]): Omit<Users, U> {
    return remove(this, ...keys);
  }
}

export default Users;
