import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BackendConfigService } from 'src/core/services/backend-config.service';

@Injectable()
export class NodeMailerService {
  private readonly logger = new Logger(NodeMailerService.name);
  constructor(
    private readonly configService: BackendConfigService,
    private readonly mailerService: MailerService,
  ) { }
  public async sendEmail(
    receivers: Array<string>,
    subject: string,
    text: string
  ) {
    this.mailerService
      .sendMail({
        to: receivers, // list of receivers
        subject,
        text
      })
      .then((rs) => {
        console.info(rs)
      })
      .catch((err) => {
        this.logger.debug(`Send mail error: ${JSON.stringify(err)}`);
      });
  }
}
