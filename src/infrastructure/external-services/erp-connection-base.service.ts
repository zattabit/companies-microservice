import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ErpConnectionBaseService {
  private readonly logger = new Logger(ErpConnectionBaseService.name);

  constructor(private readonly httpService: HttpService) {}

  // Método para ERP tipo A (autenticação por credentials)
  async connectTypeA(endpoint: string, credentials: string) {
    try {
      const response = await this.httpService
        .get(`${endpoint}/data`, {
          params: { credentials },
        })
        .toPromise();

      this.logger.log(
        `Dados recebidos do ERP_TYPE_A: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao conectar ao ERP_TYPE_A: ${error.message}`);
      throw error;
    }
  }

  // Método para ERP tipo B (autenticação por Bearer Token)
  async connectTypeB(endpoint: string, bearerToken: string) {
    try {
      const response = await this.httpService
        .get(`${endpoint}/data`, {
          headers: { Authorization: `Bearer ${bearerToken}` },
        })
        .toPromise();

      this.logger.log(
        `Dados recebidos do ERP_TYPE_B: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao conectar ao ERP_TYPE_B: ${error.message}`);
      throw error;
    }
  }

  handleError(error: any, type: string) {
    this.logger.error(`Erro ao conectar ao ${type}: ${error.message}`);
    throw error;
  }
}
