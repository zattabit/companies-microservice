import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseProvider {
  private dataSource: DataSource;

  constructor(private configService: ConfigService) {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: +this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });

    this.initialize();
  }

  async initialize() {
    try {
      await this.dataSource.initialize();
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error.message);
      throw error;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
