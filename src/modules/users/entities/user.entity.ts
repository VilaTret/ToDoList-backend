import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshTokensEntity } from '../../auth/entities/refresh-tokens.entity';
import { v4 } from 'uuid';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  update_at: string;

  @OneToMany(() => RefreshTokensEntity, (token) => token.user)
  refresh_tokens: RefreshTokensEntity[];

  @BeforeInsert()
  generateId() {
    this.id = v4();
  }
}
