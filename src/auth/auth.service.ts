import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    async findLocal(username: string, password: string) {
        return this.prisma.user.findUnique
    }
}
