import {
    Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

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
}
