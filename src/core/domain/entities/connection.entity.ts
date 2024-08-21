import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  endpoint: string;

  @Column()
  credentials: string;
}
