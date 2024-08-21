import { Repository } from 'typeorm';
import { Connection } from '../entities/connection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionRepository {
  constructor(
    @InjectRepository(Connection)
    private readonly repository: Repository<Connection>,
  ) {}

  async findAll(): Promise<Connection[]> {
    return this.repository.find();
  }
}
