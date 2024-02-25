import { Controller, Get, Post, Param } from '@nestjs/common';
import { DistributorRelationsService } from './distributor-relations.service';

@Controller('distributor-relations')
export class DistributorRelationsController {
  constructor(
    private readonly distributorRelationsService: DistributorRelationsService,
  ) {}

  @Post(':id/update-relations')
  updateRelations(@Param('id') id: number) {
    return this.distributorRelationsService.updateDistributorRelations(+id);
  }

  @Get()
  findAll() {
    return this.distributorRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.distributorRelationsService.findOne(+id);
  }
}
