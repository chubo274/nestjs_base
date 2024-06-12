import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nCustomService {
    constructor(
        private readonly i18nService: I18nService,
    ) { }

    async t(translateKey: string) {
        return this.i18nService.t(translateKey, { lang: I18nContext.current().lang });
    }
}
