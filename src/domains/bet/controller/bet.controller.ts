import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { CreateBetDto } from '../dto/create-bet.dto';
import { CreateWagerDto } from '../dto/create-wager.dto';
import { FinalizeBetDto } from '../dto/finalize-bet.dto';
import { BetService } from '../service/bet/bet.service';

@UseGuards(JwtAuthGuard)
@Controller('bet')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post()
  create(@Body() createBetDto: CreateBetDto, @Request() req) {
    const creatorId = req.user.id;

    return this.betService.create({ ...createBetDto, creatorId });
  }

  @Get()
  readMany(@Request() req, @Query('group') groupId: string) {
    const userId = req.user.id;

    return this.betService.findForGroup({ groupId, userId });
  }

  @Post('wager')
  createWage(@Body() createWagerDto: CreateWagerDto, @Request() req) {
    const creatorId = req.user.id;

    return this.betService.placeWager({ ...createWagerDto, creatorId });
  }

  @Post('finalize')
  finalizeBet(@Body() finalizeDto: FinalizeBetDto, @Request() req) {
    const userId = req.user.id;
    const { betId, winningOptionId } = finalizeDto;

    return this.betService.finalizeBet({ userId, betId, winningOptionId });
  }

  @Delete('/:id')
  deleteBet(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;

    return this.betService.delete(id, userId);
  }
}
