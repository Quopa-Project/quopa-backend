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

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ValidationToken)
        private validationTokenRepository: Repository<ValidationToken>,
        private jwtService: JwtService,
        private mailService: MailService,
        private dataSource: DataSource
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const { email, password } = registerUserDto;

        const userExisting = await this.userRepository.findOneBy({
            email
        });
        if (userExisting) {
            throw new BadRequestException({
                message: ['Email ya está en uso.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

            this.mailService.sendAccountVerificationEmail(email, savedValidationToken.token).then();

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

        if (!user.validationToken.accountVerified) {
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
