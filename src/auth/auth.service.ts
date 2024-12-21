import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service'
import { ValidationService } from '../common/validation.service';
import { AuthTypes } from 'src/types/auth.types';
import { AUTHVALIDATION } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { USER } from 'src/types/web.types';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly validationService:ValidationService,
        private readonly jwtService:JwtService,
        @Inject(refreshConfig.KEY) private readonly refreshTokenConfiguration: ConfigType<typeof refreshConfig>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) {}

    async signup(body:AuthTypes.SIGNUP):Promise<AuthTypes.RESPON_SIGNUP | string>{
        try {
            const userSignup= this.validationService.validate(AUTHVALIDATION.SIGNUP, body);
            userSignup.password=await bcrypt.hash(userSignup.password, 10);

            const findUser=await this.prisma.user.count({
                where:{
                    email:userSignup.email
                }
            })

            if(findUser>0){
                throw new Error('User already exist');
            }
            
            const user=await this.prisma.user.create({
               data:{
                   name:userSignup.name,
                   email:userSignup.email,
                   password:userSignup.password
               }
            })
            
            if(!user){
                throw new Error('User not created');
            }

           return{
                id:user.id,
                email:user.email,
                name:user.name,
           }
        } catch (error) {
            if(error instanceof Error){
                throw new Error(error.message)
            }
            throw new Error("Unpredicted error");
        }
    }

    async ValidationLocal(dataUserSignin: AuthTypes.SIGNIN): Promise<AuthTypes.RESPON_VALIDATE_LOCAL> {
        const user = this.validationService.validate(AUTHVALIDATION.SIGNIN, dataUserSignin);
        try {
            const findUser = await this.prisma.user.findUnique({
                where: {
                    email: user.email,
                },
            });
    
            if (!findUser) {
                throw new Error("User not found");
            }
            const isMatchPassword = await bcrypt.compare(user.password, findUser.password);
    
            if (!isMatchPassword) {
                throw new Error("Invalid password");
            }
    
            return {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
            };
        } catch (error) {
            throw new UnauthorizedException(error instanceof Error ? error.message : 'Unauthorized');
        }
    }

    async validateJwtUser(userId:string){
        const user=await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        return {
            id:user.id,
            name:user.name,
            email:user.email
        }
    }

    async generateTokens(userId:string){
        const payload:AuthTypes.AUTH_JWT_PAYLOAD={ sub:userId }
        const [accessToken, refreshToken]=await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfiguration)
        ])
        return {
            accessToken,
            refreshToken
        }
    }

    async signinFunction(dataUser:USER){
        const { accessToken, refreshToken }= await this.generateTokens(dataUser.id)
        const hashedRT=await hash(refreshToken)

        await this.prisma.user.update({
            where:{
                id:dataUser.id
            },
            data:{
                hashRT:hashedRT
            }
        })
        return {
            ...dataUser,
            accessToken,
            refreshToken
        }
    }

    async validateRefresh(userId: string, refreshToken: string) {
        const user=await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        const isMatch=await verify(user.hashRT, refreshToken);
        if(!isMatch){
            throw new UnauthorizedException("Invalid refresh token")
        }
        return {
            id:user.id,
            name:user.name,
            email:user.email
        }
    }

    async refreshToken(user:USER){
        const { accessToken, refreshToken } = await this.generateTokens(user.id)

        const hashedRT=await hash(refreshToken);

        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                hashRT:hashedRT
            }
        })
        return {
            ...user,
            accessToken,
            refreshToken
        }
    }

    async signoutFunction(userId: string) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashRT: null,
            },
        });
        return true
    }
    
}
