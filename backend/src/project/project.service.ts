import { Injectable } from '@nestjs/common';
import { ProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: ProjectDto, filename?: string | null) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        header: filename ? `/uploads/${filename}` : null,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      where: { deletedAt: null },
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
