import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type!: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFavorite: boolean = false;

  locationBasicInfo?: LocationBasicInfoDto;
}

export class LocationBasicInfoDto {
  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsArray()
  inhabitants?: string[];

  @IsOptional()
  @IsNumber()
  population?: number;

  @IsOptional()
  @IsArray()
  items?: string[];

  @IsOptional()
  @IsString()
  militaryStrength?: string;
}
