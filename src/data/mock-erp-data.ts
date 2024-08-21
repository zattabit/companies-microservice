import { faker } from '@faker-js/faker';

export const mockErpConnections = [
  {
    id: faker.number.int(),
    type: 'ERP_TYPE_A',
    endpoint: 'http://localhost:3001',
    credentials: faker.internet.password(),
    isValidConnection() {
      return this.endpoint.startsWith('http://') && !!this.credentials;
    },
  },
  {
    id: faker.number.int(),
    type: 'ERP_TYPE_B',
    endpoint: 'http://localhost:3002',
    bearerToken: faker.internet.password(),
    isValidConnection() {
      return this.endpoint.startsWith('http://') && !!this.bearerToken;
    },
  },
];
