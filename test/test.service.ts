import { Injectable } from "@nestjs/common";
import { PrismaService } from "./../src/common/prisma.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export class TestService {
    constructor(private readonly prisma:PrismaService) {}

    async createuser(){
        await this.prisma.user.create({
            data:{
                name:"test",
                email:"test@gmail.com",
                password:await bcrypt.hash('pwTest1234', 10)
            }
        })
    }
}