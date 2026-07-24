import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class ProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFavorite: boolean = false;

  // header is handled separeted
}

export class UpdateProjectDto extends ProjectDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  removeHeader?: boolean;
}
