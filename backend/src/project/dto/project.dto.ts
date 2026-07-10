import { IsOptional, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  header?: string;
}
