import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../location.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  createBasicLocationDto,
  createDtoWithBasicInfo,
  filesNames,
  updateBasicLocationDto,
  updateDtoWithBasicInfo,
} from './constants';

describe('LocationService', () => {
  let service: LocationService;

  const prismaMock = {
    location: {
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
        LocationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('calls prisma.location.create() without images and without basic info', async () => {
    await service.create(createBasicLocationDto);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: createBasicLocationDto,
    });
  });

  it('calls prisma.location.create() without images and with basic info', async () => {
    await service.create(createDtoWithBasicInfo);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        ...createDtoWithBasicInfo,
        basicInfo: {
          create: createDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.create() with images and without basic info', async () => {
    await service.create(createBasicLocationDto, filesNames);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        ...createBasicLocationDto,
        images: {
          create: filesNames.map((image) => ({ filename: image })),
        },
      },
    });
  });

  it('calls prisma.location.create() with images and with basic info', async () => {
    await service.create(createDtoWithBasicInfo, filesNames);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        ...createDtoWithBasicInfo,
        images: {
          create: filesNames.map((image) => ({ filename: image })),
        },
        basicInfo: {
          create: createDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.findMany()', async () => {
    await service.findAll(false, false);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null, isFavorite: undefined },
      // orderBy: {
      //   name: 'asc',
      // },
    });
  });

  it('calls prisma.location.findUnique()', async () => {
    const id = '1';

    await service.findOne(id);

    expect(prismaMock.location.findUnique).toHaveBeenCalledWith({
      where: { id, deletedAt: null },
    });
  });

  it('calls prisma.location.update() without images and without basic info', async () => {
    const id = '1';

    await service.update(id, updateBasicLocationDto);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: updateBasicLocationDto,
    });
  });

  it('calls prisma.location.update() without images and with basic info', async () => {
    const id = '1';

    await service.update(id, updateDtoWithBasicInfo);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        ...updateDtoWithBasicInfo,
        basicInfo: {
          create: updateDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.update() with images and without basic info', async () => {
    const id = '1';

    await service.update(id, updateBasicLocationDto, filesNames);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        ...updateBasicLocationDto,
        images: {
          create: filesNames.map((image) => ({ filename: image })),
        },
      },
    });
  });

  it('calls prisma.location.update() with images and with basic info', async () => {
    const id = '1';

    await service.update(id, updateDtoWithBasicInfo, filesNames);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        ...updateDtoWithBasicInfo,
        images: {
          create: filesNames.map((image) => ({ filename: image })),
        },
        basicInfo: {
          create: updateDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.update() for remove()', async () => {
    const id = '1';

    await service.remove(id);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('calls prisma.location.get() with isOnlyFavoriteFilter correctly', async () => {
    await service.findAll(true, false);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null, isFavorite: true },
      // orderBy: {
      //   name: 'asc',
      // },
    });
  });

  it('calls prisma.location.get() with isOnlyDeletedFilter correctly', async () => {
    await service.findAll(false, true);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: { deletedAt: { not: null }, isFavorite: undefined },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('calls prisma.location.get() with isOnlyFavoriteFilter and isOnlyDeletedFilter correctly', async () => {
    await service.findAll(true, true);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: { deletedAt: { not: null }, isFavorite: true },
      // orderBy: {
      //   name: 'asc',
      // },
    });
  });

  it('calls prisma.location.delete() for removePermanently()', async () => {
    const id = '1';

    await service.removePermanently(id);

    expect(prismaMock.location.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('calls prisma.location.update() for restore()', async () => {
    const id = '1';

    await service.restore(id);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: { id },
      data: { deletedAt: null },
    });
  });
});
