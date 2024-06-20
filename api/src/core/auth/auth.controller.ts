import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OtpAction, User, UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { UserStatus } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { NodeMailerService } from 'src/core/node-mailer/node-mailer.service';
import { UserService } from 'src/models/user/user.service';
import { excludeObject, generateCustomAlphaBet } from 'src/helpers/functions/common.utils';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { User as UserDecorator } from './decorators/user.decorator';
import { LoginDto } from './dtos/auth-login.dto';
import { ChangePassword, ForgotPassword, VerifyOtpDto } from './dtos/forgot-password.dto';
import { Register } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IUserJwt } from './strategies/jwt.strategy';

export interface LoginData {
    phone?: string;
    phoneCode?: string;
    email?: string;
    password: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly i18n: I18nService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly nodeMailer: NodeMailerService,
    ) { }
    @Post('login')
    async login(@Body() body: LoginDto) {
        let loginData: LoginData = {
            email: body.email,
            password: body.password,
        };
        const user = await this.userService.findOne({
            where: { email: loginData.email, status: { not: UserStatus.DELETED } },
        });
        if (!user) throw new BaseException(Errors.ITEM_NOT_FOUND('User'));

        if (user.status == UserStatus.BANNED) {
            throw new BaseException(
                Errors.BAD_REQUEST(
                    'User has been banned. Please contact admin for more information',
                ),
            );
        }

        if (
            !(await this.authService.comparePassword(
                loginData.password,
                user.password,
            ))
        ) {
            throw new BaseException(Errors.WRONG_PASSWORD());
        }

        let payload: IJwtPayload;
        payload = {
            sub: user.id,
            role: user.role,
        };

        if (!user?.email) throw new BaseException(Errors.BAD_REQUEST("Account does not register email. Please contact admin for support"))

        let accessToken = await this.authService.generateAccessToken(payload);

        // const otp = await this.otpService.createOtp(
        //     OtpAction.LOGIN,
        //     user.email,
        // )

        // await this.nodeMailer.sendEmail(
        //     [user.email],
        //     `OTP Login`,
        //     `Your OTP to login is ${otp?.code}`
        // );

        return {
            message: "Send Email Success",
            isNeedOTP: true
        }
    }

    @Post("verify-otp-login")
    async verifyOtpLogin(
        @Body() body: VerifyOtpDto
    ) {
    }

    @Post('register')
    async register(@Body() body: Register) {
        let user: User;
        user = await this.userService.findOne({
            where: { email: body.email, status: { not: UserStatus.DELETED } },
        });

        if (user)
            throw new BaseException(Errors.BAD_REQUEST('Email has been registered'));

        if (body.phone && body.phoneCode) {
            user = await this.userService.findOne({
                where: {
                    phone: body.phone,
                    phoneCode: body.phoneCode,
                    status: { not: UserStatus.DELETED },
                },
            });
        }

        if (user)
            throw new BaseException(
                Errors.BAD_REQUEST('PhoneNumber has been registered'),
            );

        user = await this.userService.create({
            data: {
                phone: body.phone,
                email: body.email,
                phoneCode: body.phoneCode,
                password: await this.authService.hashPassword(body.password),
                firstName: body.firstName,
                lastName: body.lastName,
            },
        });

        let payload: IJwtPayload;
        payload = {
            sub: user.id,
            role: user.role,
        };

        let accessToken = await this.authService.generateAccessToken(payload);

        // Save access token to db
        // await this.userService.update(customer.id, {
        //   lastAccessToken: accessToken,
        // });

        const _user = excludeObject(user, ['password']);

        return {
            accessToken,
            user: _user,
        };
    }

    @Post("forgot-password")
    async forgotPassword(
        @Body() body: ForgotPassword
    ) {
        const user = await this.userService.findOne({ where: { email: body.email, status: { not: UserStatus.DELETED } } })
        if (!user) throw new BaseException(Errors.ITEM_NOT_FOUND('User'));

        if (!user?.email)
            throw new BaseException(Errors.BAD_REQUEST("Account does not register email. Please contact admin for support"))
        // const otp = await this.otpService.createOtp(
        //   OtpAction.FORGOT_PASSWORD,
        //   user.email,
        // )
        const newPassword = generateCustomAlphaBet()
        await this.nodeMailer.sendEmail(
            [user.email],
            `Password Reset`,
            `Your password to reset password is ${newPassword}`
        );
        await this.userService.update(user.id, { password: await this.authService.hashPassword(newPassword) })
        return { message: "Send Email Success" }
    }

    // @Post("verify-otp")
    // async verifyOtp(
    //     @Body() body: VerifyOtpDto
    // ) {
    //     const user = await this.userService.findOne({ where: { email: body.email, NOT: { status: UserStatus.DELETED } } })
    //     if (!user) throw new BaseException(Errors.ITEM_NOT_FOUND('User'));
    //     const otp = await this.otpService.verifyOtp(body.otpAction, body.otpCode, body.email)
    //     if (!otp) throw new BaseException(Errors.BAD_REQUEST("Otp not found"))
    //     await this.userService.update(user.id, { isVerifyOtp: true })
    //     return { message: 'Verify Otp Successful' };

    // }

    @Post('change-password-otp')
    async changePassword(@Body() body: ChangePassword) {
        if (body.password !== body.confirmPassword)
            throw new BaseException(Errors.CONFIRM_PASSWORD_NOT_MATCH());
        const existsUser: User = await this.userService.findOne({ where: { email: body.email, status: { not: UserStatus.DELETED } } })
        if (!existsUser) throw new BaseException(Errors.ITEM_NOT_FOUND("User"));
        if (!existsUser.isVerifyOtp) throw new BaseException(Errors.BAD_REQUEST("Account is not verify otp"));
        if (existsUser.status === UserStatus.BANNED) throw new BaseException(Errors.BAD_REQUEST("Account has been banned"));

        const payload = { sub: existsUser.id, role: existsUser.role };

        let accessToken = await this.authService.generateAccessToken(payload);

        await this.userService.update(
            existsUser.id,
            {
                password: await this.authService.hashPassword(body.password),
                isVerifyOtp: false
            },
        );
        return { message: `Update password successfully`, accessToken, user: existsUser };
    }

    @ApiBearerAuth()
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getProfile(
        @UserDecorator() user: IUserJwt

    ) {
        return this.userService.findOne({ where: { id: user.data.id } })
    }

}
