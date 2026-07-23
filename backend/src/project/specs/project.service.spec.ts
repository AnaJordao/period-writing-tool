import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PrismaService } from '../../../prisma/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;

  const prismaMock = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('calls prisma.project.create()', async () => {
    const dto = {
      name: 'My Project',
      description: 'Description',
      header: null,
    };
    const dto2 = {
      name: 'My Project',
      description: 'Description',
    };

    await service.create(dto);
    await service.create(dto2);

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: dto,
    });
    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: { ...dto2, header: null },
    });
  });

  it('calls prisma.project.findMany()', async () => {
    await service.findAll({ sortBy: 'name', order: 'asc' });

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('calls prisma.project.findUnique()', async () => {
    const id = '1';

    await service.findOne(id);

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id, deletedAt: null },
    });
  });

  it('calls prisma.project.update()', async () => {
    const id = '1';
    const dto = {
      name: 'Updated Project',
      description: 'Updated Description',
      header: 'new-header.png',
    };

    await service.update(id, dto);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: dto,
    });
  });

  it('calls prisma.project.update() for removeHeader', async () => {
    const id = '1';
    const dto = {
      name: 'Updated Project',
      description: 'Updated Description',
      removeHeader: true,
    };

    await service.update(id, dto);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        name: 'Updated Project',
        description: 'Updated Description',
        header: null,
      },
    });
  });

  it('calls prisma.project.update() for removeHeader with new header', async () => {
    const id = '1';
    const dto = {
      name: 'Updated Project',
      description: 'Updated Description',
      removeHeader: true,
    };
    const filename = 'new-header.png';

    await service.update(id, dto, filename);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        name: 'Updated Project',
        description: 'Updated Description',
        header: `/uploads/${filename}`,
      },
    });
  });

  it('calls prisma.project.update() for remove()', async () => {
    const id = '1';

    await service.remove(id);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: { deletedAt: expect.any(Date) },
    });
  });
});
