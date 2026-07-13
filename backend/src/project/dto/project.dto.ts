import { IsOptional, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  // header is handled separeted
}
