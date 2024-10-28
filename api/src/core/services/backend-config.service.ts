import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { COMMON_CONSTANT } from 'src/helpers/constants/common.constant';

@Injectable()
export class BackendConfigService {
  private logger = new Logger(BackendConfigService.name);
  constructor(private configService: ConfigService) { }

  getEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (isNil(value)) {
      this.logger.error(`Environment variable ${key} not set!`);
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
    return value;
  }
  getRedisConfig(): RedisClientOptions[] {
    return [
      {
        namespace: COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
        connectionName: COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
        password: this.getEnv('REDIS_PASSWORD'),
        host: this.getEnv('REDIS_HOST'),
        port: Number(this.getEnv('REDIS_PORT')),
      },
    ];
  }
}
