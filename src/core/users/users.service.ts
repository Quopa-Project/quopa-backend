import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {User, UserRole} from "./entity/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from 'typeorm';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {MailService} from "../../mail/mail.service";
import {ValidationToken} from "./entity/validation-tokens.entity";
import {VerificationCode} from "./entity/verification-code.entity";
import {SendCodeDto} from "./dto/send-code.dto";
import {VerifyCodeDto} from "./dto/verify-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ValidationToken)
        private validationTokenRepository: Repository<ValidationToken>,
        @InjectRepository(VerificationCode)
        private verificationCodeRepository: Repository<VerificationCode>,
        private jwtService: JwtService,
        private mailService: MailService,
        private dataSource: DataSource
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const userExisting = await this.userRepository.findOneBy({
            email: registerUserDto.email
        });
        if (userExisting) {
            throw new BadRequestException({
                message: ['Email ya está en uso.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

        const savedUser = await this.dataSource.transaction(async manager => {
            const userRepository = manager.getRepository(User);
            const validationTokenRepository = manager.getRepository(ValidationToken);

            const newUser = userRepository.create({
                ...registerUserDto,
                password: hashedPassword,
                role: UserRole.CLIENT,
                tokenVersion: 1
            });
            const savedUser = await userRepository.save(newUser);

            const payload = {
                sub: savedUser.id,
                tokenVersion: savedUser.tokenVersion
            };
            const token = this.jwtService.sign(payload);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);

            const newValidationToken = validationTokenRepository.create({
                accountVerified: false,
                token: token,
                tokenExpiration: expirationDate,
                user: savedUser
            });
            const savedValidationToken = await validationTokenRepository.save(newValidationToken);

            this.mailService.sendAccountVerificationEmail(registerUserDto.email, savedValidationToken.token);

            return savedUser;
        });

        return { user: savedUser };
    }

    async validateToken(userId: number) {
        const validationToken = await this.validationTokenRepository.findOneBy({
            user: { id: userId }
        });
        if (!validationToken) {
            throw new BadRequestException({
                message: ['No existe validación para el usuario.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        if (validationToken.tokenExpiration < new Date()) {
            throw new BadRequestException({
                message: ['El token ha expirado.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        if (validationToken.accountVerified) {
            throw new BadRequestException({
                message: ['El usuario ya ha sido validado.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        await this.validationTokenRepository.update(validationToken.id, { accountVerified: true });

        return { message: 'success' };
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['validationToken']
        });
        if (!user) {
            throw new UnauthorizedException({
                message: ['Correo o contraseña inválidos.'],
                error: "Unauthorized",
                statusCode: 401
            });
        }

        if (user.role == UserRole.CLIENT && !user.validationToken.accountVerified) {
            throw new UnauthorizedException({
                message: ['Necesita validar su correo con el enlace que le hemos enviado.'],
                error: "Unauthorized",
                statusCode: 401
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException({
                message: ['Correo o contraseña inválidos.'],
                error: "Unauthorized",
                statusCode: 401
            });
        }

        const payload = {
            sub: user.id,
            tokenVersion: user.tokenVersion
        };
        const token = this.jwtService.sign(payload);

        return {
            token: token,
            role: user.role
        };
    }

    async findById(id: number) {
        const user = await this.userRepository.findOneBy({
            id
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { user };
    }

    async sendVerificationCode(sendCodeDto: SendCodeDto) {
        const user = await this.userRepository.findOneBy({
            email: sendCodeDto.email
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await this.mailService.sendVerificationCodeEmail(sendCodeDto.email, code);

        const verificationCode = this.verificationCodeRepository.create({
            code: code,
            isUsed: false,
            user: user,
        });
        await this.verificationCodeRepository.save(verificationCode);

        return { message: 'Correo enviado correctamente.' };
    }

    async verifyCode(verifyCodeDto: VerifyCodeDto) {
        const user = await this.userRepository.findOneBy({
            email: verifyCodeDto.email
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const verificationCode = await this.verificationCodeRepository.findOne({
            where: {
                user: { id: user.id },
                code: verifyCodeDto.code,
                isUsed: false,
            },
            order: { createdAt: 'DESC' }
        });
        if (!verificationCode) {
            throw new BadRequestException({
                message: ['Código ya usado o inválido.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        await this.verificationCodeRepository.update(verificationCode.id, { isUsed: true });

        return { message: 'Código validado correctamente.' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userRepository.findOneBy({
            email: resetPasswordDto.email
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

        if (resetPasswordDto.invalidateTokens) {
            user.tokenVersion = user.tokenVersion + 1;
            await this.userRepository.update(user.id, { password: hashedPassword, tokenVersion: user.tokenVersion });
        } else {
            await this.userRepository.update(user.id, { password: hashedPassword });
        }

        return { message: 'Contraseña actualizada correctamente.' };
    }

    async findByIdToValidateToken(id: number) {
        const user = await this.userRepository.findOneBy({
            id
        });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return { user };
    }
}
