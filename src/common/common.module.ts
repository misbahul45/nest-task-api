import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception.filter';


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
    exports:[PrismaService, ValidationService],
    providers:[PrismaService, ValidationService,
        {
            provide:APP_FILTER,
            useClass:HttpExceptionFilter
        }
    ]
})
export class CommonModule {}
