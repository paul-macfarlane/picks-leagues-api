import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John', maxLength: 100 })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ example: 'Doe', maxLength: 100 })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '2025-05-31T19:28:21.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-05-31T19:28:21.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
