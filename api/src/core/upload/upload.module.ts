import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import moment from 'moment';
import slug from 'slug';
import { RegexConstant } from 'src/helpers/constants/regex.constant';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import fs from 'fs';

@Module({
    imports: [
        MulterModule.register({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    if (
                        file.mimetype.match(
                            /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml|video\/mp4|docx\/|doc\/|txt/,
                        )
                    ) {
                        const rootPath = path.join(
                            __dirname,
                            '..',
                            '..',
                            '..',
                            '..',
                            'public',
                            'uploads',
                        );

                        cb(null, getUploadPath(rootPath));
                    }
                    else if (
                        file.mimetype.match(
                            RegexConstant.PdfReg
                        )
                    ) {
                        const rootPath = path.join(
                            __dirname,
                            '..',
                            '..',
                            '..',
                            '..',
                            'public',
                            'uploads',
                            'pdf',
                        );

                        cb(null, getUploadPath(rootPath));
                    }
                    else {
                        cb(
                            new HttpException(
                                `Unsupported file type ${path.extname(file.originalname)}`,
                                HttpStatus.BAD_REQUEST,
                            ),
                            null,
                        );
                    }
                },
                filename: function (req, file, cb) {
                    const fileExtname = path.extname(file.originalname);
                    const fileName = file.originalname.replace(fileExtname, '');
                    const uniqueSuffix = `${moment().format(
                        'HHmmssDDMMYYYY',
                    )}${Math.round(Math.random() * 1e6)}`;
                    cb(null, `${slug(fileName)}-${uniqueSuffix}${fileExtname}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                if (
                    file.mimetype.match(
                        /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml|video\/mp4|application\/pdf|\docx|doc\|txt/,
                    )
                ) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            `Unsupported file type ${path.extname(file.originalname)}`,
                            HttpStatus.BAD_REQUEST,
                        ),
                        false,
                    );
                }
            },
            preservePath: true,
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }

// function

export const getUploadPath = (rootPath: string) => {
    const pathYear = path.join(
        rootPath,
        moment().get('year').toString(),
    );

    const pathMonth = path.join(
        pathYear,
        (moment().get('month') + 1).toString(),
    );
    const pathDay = path.join(
        pathMonth,
        moment().get('day').toString(),
    );
    if (!fs.existsSync(pathYear)) {
        fs.mkdirSync(pathYear, { recursive: true });
    }
    if (!fs.existsSync(pathMonth)) {
        fs.mkdirSync(pathMonth);
    }
    if (!fs.existsSync(pathDay)) {
        fs.mkdirSync(pathDay);
    }

    return pathDay;
};