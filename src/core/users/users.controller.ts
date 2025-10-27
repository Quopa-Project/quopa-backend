import {
    Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {SendCodeDto} from "./dto/send-code.dto";
import {VerifyCodeDto} from "./dto/verify-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    register(@Body() userDto: RegisterUserDto) {
        return this.usersService.register(userDto);
    }

    @Get('validate-token')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    validateToken(@Request() req: any) {
        return this.usersService.validateToken(req.user.id);
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    login(@Body() userDto: LoginUserDto) {
        return this.usersService.login(userDto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    getProfile(@Request() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Post('verification/send-verification-code')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    sendVerificationCode(@Body() sendCodeDto: SendCodeDto) {
        return this.usersService.sendVerificationCode(sendCodeDto);
    }

    @Post('verification/verify-code')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.usersService.verifyCode(verifyCodeDto);
    }

    @Post('verification/reset-password')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }
}
