import {
  Controller,
  Get,
  Post,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErpConnectionService } from '../../infrastructure/external-services/erp-connection.service';

@Controller('erp')
export class ErpController {
  constructor(private readonly erpConnectionService: ErpConnectionService) {}

  @Post('sync')
  async manualSync() {
    try {
      console.log('Iniciando sincronização manual...');
      const results = await this.erpConnectionService.processAllErps();

      console.log('Resultados obtidos:', results);

      return { message: 'Sincronização manual concluída com sucesso', results };
    } catch (error) {
      console.error('Erro durante a sincronização manual:', error);
      throw new InternalServerErrorException(
        'Erro ao iniciar a sincronização manual',
      );
    }
  }

  @Get('processed-users')
  getProcessedUsers() {
    return this.erpConnectionService.getProcessedUsers();
  }
}
