import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'
import { PrismaService } from './prisma.client';

@Global()  
@Module({
    imports:[
        WinstonModule.forRoot({ 
            transports:[
                new winston.transports.Console({
                    format:winston.format.simple()
                }),
                new winston.transports.File({
                    filename:'app.log',
                    format:winston.format.json(),
                })
            ]
        })
    ],
    exports:[PrismaService],
    providers:[PrismaService]
})
export class CommonModule {}
