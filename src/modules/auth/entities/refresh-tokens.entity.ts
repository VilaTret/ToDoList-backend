import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
@Unique(['user_agent', 'user'])
export class RefreshTokensEntity {
  @PrimaryColumn('uuid')
  token: string;

  @Column({ type: 'timestamp with time zone' })
  exp: string;

  @Column({ type: 'varchar' })
  user_agent: string;

  @ManyToOne(() => UserEntity, (user) => user.refresh_tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
