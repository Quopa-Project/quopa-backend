import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {User} from "./entity/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
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

        const newUser = this.userRepository.create({
            ...registerUserDto,
            password: hashedPassword,
            tokenVersion: 1,
            accountVerified: false
        });

        const savedUser = await this.userRepository.save(newUser);

        return { user: savedUser };
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.userRepository.findOneBy({
            email
        });
        if (!user) {
            throw new UnauthorizedException({
                message: ['Correo o contraseña inválidos.'],
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
