import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { CreateBetDto } from '../dto/create-bet.dto';
import { BetService } from '../service/bet/bet.service';

@Controller('bet')
export class BetController {
    constructor(private readonly betService: BetService) {

    }

    @UseGuards(JwtAuthGuard)
    @Post()
  create(@Body() createBetDto: CreateBetDto, @Request() req) {
    const creatorId = req.user.id;

    return this.betService.create({ ...createBetDto, creatorId});
  }
}
