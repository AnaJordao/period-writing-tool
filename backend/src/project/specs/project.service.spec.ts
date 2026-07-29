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
      delete: jest.fn(),
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
      isFavorite: false,
    };
    const dto2 = {
      name: 'My Project',
      description: 'Description',
      isFavorite: false,
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
    await service.findAll({ sortBy: 'name', order: 'asc' }, false, false);

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null, isFavorite: undefined },
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
      isFavorite: false,
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
      isFavorite: false,
      removeHeader: true,
    };

    await service.update(id, dto);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        name: 'Updated Project',
        description: 'Updated Description',
        header: null,
        isFavorite: false,
      },
    });
  });

  it('calls prisma.project.update() for removeHeader with new header', async () => {
    const id = '1';
    const dto = {
      name: 'Updated Project',
      description: 'Updated Description',
      isFavorite: true,
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
        isFavorite: true,
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

  it('calls prisma.project.get() with isOnlyFavoriteFilter correctly', async () => {
    await service.findAll({ sortBy: 'name', order: 'asc' }, true, false);

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null, isFavorite: true },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('calls prisma.project.get() with isOnlyDeletedFilter correctly', async () => {
    await service.findAll({ sortBy: 'name', order: 'asc' }, false, true);

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { deletedAt: { not: null }, isFavorite: undefined },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('calls prisma.project.get() with isOnlyFavoriteFilter and isOnlyDeletedFilter correctly', async () => {
    await service.findAll({ sortBy: 'name', order: 'asc' }, true, true);

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      where: { deletedAt: { not: null }, isFavorite: true },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('calls prisma.project.delete() for removePermanently()', async () => {
    const id = '1';

    await service.removePermanently(id);

    expect(prismaMock.project.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('calls prisma.project.update() for restore()', async () => {
    const id = '1';

    await service.restore(id);

    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id },
      data: { deletedAt: null },
    });
  });
});
