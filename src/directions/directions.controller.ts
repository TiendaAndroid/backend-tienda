import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createDirectionDto: CreateDirectionDto) {
    return this.directionsService.create(req.user.id, createDirectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  findOne(@Req() req) {
    return this.directionsService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneDirection(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.directionsService.findOneDirection(req.user.id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDirectionDto: UpdateDirectionDto,
  ) {
    return this.directionsService.update(req.user.id, id, updateDirectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.directionsService.remove(req.user.id, id);
  }
}
