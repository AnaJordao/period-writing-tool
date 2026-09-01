import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

import { LocationService } from '../location.service';
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
    jest.clearAllMocks();

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

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  it('calls prisma.location.create() without images and without basic info', async () => {
    await service.create(createBasicLocationDto);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        ...createBasicLocationDto,
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.create() without images and with basic info', async () => {
    await service.create(createDtoWithBasicInfo);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        description: createDtoWithBasicInfo.description,
        isFavorite: createDtoWithBasicInfo.isFavorite,
        name: createDtoWithBasicInfo.name,
        type: createDtoWithBasicInfo.type,
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
        images: filesNames.map((image) => `/uploads/${image}`),
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.create() with images and with basic info', async () => {
    await service.create(createDtoWithBasicInfo, filesNames);

    expect(prismaMock.location.create).toHaveBeenCalledWith({
      data: {
        description: createDtoWithBasicInfo.description,
        isFavorite: createDtoWithBasicInfo.isFavorite,
        name: createDtoWithBasicInfo.name,
        type: createDtoWithBasicInfo.type,

        images: filesNames.map((image) => `/uploads/${image}`),

        basicInfo: {
          create: createDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  // ---------------------------------------------------------------------------
  // FIND ALL
  // ---------------------------------------------------------------------------

  it('calls prisma.location.findMany() without filters', async () => {
    await service.findAll(false, false);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        isFavorite: undefined,
      },
    });
  });

  it('calls prisma.location.findMany() with isOnlyFavoriteFilter', async () => {
    await service.findAll(true, false);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        isFavorite: true,
      },
    });
  });

  it('calls prisma.location.findMany() with isOnlyDeletedFilter', async () => {
    await service.findAll(false, true);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: {
          not: null,
        },
        isFavorite: undefined,
      },
    });
  });

  it('calls prisma.location.findMany() with both filters', async () => {
    await service.findAll(true, true);

    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: {
          not: null,
        },
        isFavorite: true,
      },
    });
  });

  // ---------------------------------------------------------------------------
  // FIND ONE
  // ---------------------------------------------------------------------------

  it('calls prisma.location.findUnique()', async () => {
    const id = '1';

    await service.findOne(id);

    expect(prismaMock.location.findUnique).toHaveBeenCalledWith({
      where: {
        id,
        deletedAt: null,
      },
    });
  });

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  it('calls prisma.location.update() without images and without basic info', async () => {
    const id = '1';

    await service.update(id, updateBasicLocationDto);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: {
        id,
      },
      data: {
        ...updateBasicLocationDto,
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.update() without images and with basic info', async () => {
    const id = '1';

    await service.update(id, updateDtoWithBasicInfo);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: {
        id,
      },
      data: {
        description: updateDtoWithBasicInfo.description,
        isFavorite: updateDtoWithBasicInfo.isFavorite,
        name: updateDtoWithBasicInfo.name,
        type: updateDtoWithBasicInfo.type,

        basicInfo: {
          update: updateDtoWithBasicInfo.locationBasicInfo,
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
      where: {
        id,
      },
      data: {
        ...updateBasicLocationDto,
        images: filesNames.map((image) => `/uploads/${image}`),
      },
      include: {
        basicInfo: true,
      },
    });
  });

  it('calls prisma.location.update() with images and with basic info', async () => {
    const id = '1';

    await service.update(id, updateDtoWithBasicInfo, filesNames);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: {
        id,
      },
      data: {
        description: updateDtoWithBasicInfo.description,
        isFavorite: updateDtoWithBasicInfo.isFavorite,
        name: updateDtoWithBasicInfo.name,
        type: updateDtoWithBasicInfo.type,

        images: filesNames.map((image) => `/uploads/${image}`),

        basicInfo: {
          update: updateDtoWithBasicInfo.locationBasicInfo,
        },
      },
      include: {
        basicInfo: true,
      },
    });
  });

  // ---------------------------------------------------------------------------
  // REMOVE
  // ---------------------------------------------------------------------------

  it('calls prisma.location.update() for remove()', async () => {
    const id = '1';

    await service.remove(id);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: {
        id,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  // ---------------------------------------------------------------------------
  // REMOVE PERMANENTLY
  // ---------------------------------------------------------------------------

  it('calls prisma.location.delete() for removePermanently()', async () => {
    const id = '1';

    await service.removePermanently(id);

    expect(prismaMock.location.delete).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
  });

  // ---------------------------------------------------------------------------
  // RESTORE
  // ---------------------------------------------------------------------------

  it('calls prisma.location.update() for restore()', async () => {
    const id = '1';

    await service.restore(id);

    expect(prismaMock.location.update).toHaveBeenCalledWith({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  });
});
