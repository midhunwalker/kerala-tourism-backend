import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto } from './dto/create-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  async findAll(@Query('district') district?: string, @Query('category') category?: string) {
    return this.placesService.findAll({ district, category });
  }

  @Get('district/:districtId')
  async findByDistrict(@Param('districtId') districtId: string) {
    return this.placesService.findByDistrict(districtId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.placesService.remove(id);
  }
}
