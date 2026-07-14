import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dto/project.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('header', {
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + file.originalname;

          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(@Body() dto: ProjectDto, @UploadedFile() file?: Express.Multer.File) {
    return this.projectService.create(dto, file?.filename ?? null);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: ProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
