import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Users {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

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

  @Column('text', { select: false, array: true, default: () => 'array[]::text[]' })
  public refresh_tokens!: string[];

  @Column({ nullable: true, default: null })
  public avatar!: string;

  @CreateDateColumn()
  public created!: Date;

  @UpdateDateColumn()
  public updated!: Date;
}

export default Users;
