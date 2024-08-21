import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { mockErpConnections } from '../../data/mock-erp-data';

@Injectable()
export class ErpConnectionService {
  private readonly logger = new Logger(ErpConnectionService.name);
  private useMockData: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.useMockData = this.configService.get<boolean>('USE_MOCK', true);
  }

  public async processAllErps() {
    this.logger.log('Processando todos os ERPs...');

    const connections = this.useMockData
      ? mockErpConnections
      : await this.getProductionConnections();

    const tasks = connections.map(async (connection) => {
      try {
        if (connection.type === 'ERP_TYPE_A') {
          return await this.processTypeA(connection);
        } else if (connection.type === 'ERP_TYPE_B') {
          return await this.processTypeB(connection);
        }
      } catch (error) {
        this.logger.error(
          `Erro ao processar ${connection.type}: ${error.message}`,
        );
      }
    });

    const results = await Promise.all(tasks);
    return results.flat();
  }

  private async processTypeA(connection: any) {
    if (connection.isValidConnection()) {
      this.logger.log(
        `Autenticado no ERP_TYPE_A com credenciais: ${connection.credentials}`,
      );

      const response = await lastValueFrom(
        this.httpService.get(`${connection.endpoint}/data`, {
          params: { credentials: connection.credentials },
        }),
      );
      this.logger.log('Dados recebidos do ERP_TYPE_A:', response.data);
      return response.data;
    } else {
      throw new Error('Credenciais inválidas para ERP_TYPE_A');
    }
  }

  private async processTypeB(connection: any) {
    if (connection.isValidConnection()) {
      this.logger.log(
        `Autenticado no ERP_TYPE_B com Bearer Token: ${connection.bearerToken}`,
      );

      const response = await lastValueFrom(
        this.httpService.get(`${connection.endpoint}/data`, {
          headers: { Authorization: `Bearer ${connection.bearerToken}` },
        }),
      );
      this.logger.log('Dados recebidos do ERP_TYPE_B:', response.data);
      return response.data;
    } else {
      throw new Error('Token inválido para ERP_TYPE_B');
    }
  }

  private async getProductionConnections() {
    return [];
  }

  // Executa a Cron para sincronização a cada dois dias à meia-noite
  @Cron('0 0 */2 * *')
  public async handleCron() {
    this.logger.log('Iniciando sincronização automática');
    const results = await this.processAllErps();
    this.logger.log('Sincronização automática concluída:', results);
  }
}
