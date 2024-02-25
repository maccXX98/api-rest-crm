import { PartialType } from '@nestjs/mapped-types';
import { CreateDistributorRelationDto } from './create-distributor-relation.dto';

export class UpdateDistributorRelationDto extends PartialType(
  CreateDistributorRelationDto,
) {}
