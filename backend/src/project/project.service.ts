import { Injectable } from '@nestjs/common';
import { ProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Project } from '@prisma/client';
import { ProjectSorting } from '@period-writing-tool/shared';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: ProjectDto, filename?: string | null): Promise<Project> {
    return await this.prisma.project.create({
      data: {
        ...createProjectDto,
        header: filename ? `/uploads/${filename}` : null,
      },
    });
  }

  findAll({ sortBy, order }: ProjectSorting) {
    return this.prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: { [sortBy]: order },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto, filename?: string | null) {
    const { removeHeader, ...projectData } = updateProjectDto;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(removeHeader &&
          !filename && {
            header: null,
          }),
        ...(filename && {
          header: `/uploads/${filename}`,
        }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
