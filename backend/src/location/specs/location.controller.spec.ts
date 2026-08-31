import { LocationController } from '../location.controller';
import { LocationService } from '../location.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createBasicLocationDto,
  createDtoWithBasicInfo,
  files,
  updateBasicLocationDto,
  updateDtoWithBasicInfo,
} from './constants';

describe('LocationController', () => {
  let controller: LocationController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removePermanently: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls service.create() without images and without basic info', async () => {
    await controller.create(createBasicLocationDto);

    expect(serviceMock.create).toHaveBeenCalledWith(createBasicLocationDto, null);
  });

  it('calls service.create() without images and with basic info', async () => {
    await controller.create(createDtoWithBasicInfo);

    expect(serviceMock.create).toHaveBeenCalledWith(createDtoWithBasicInfo, null);
  });

  it('calls service.create() with images and without basic info', async () => {
    await controller.create(createBasicLocationDto, files);

    expect(serviceMock.create).toHaveBeenCalledWith(createBasicLocationDto, files);
  });

  it('calls service.create() with images and with basic info', async () => {
    await controller.create(createDtoWithBasicInfo, files);

    expect(serviceMock.create).toHaveBeenCalledWith(createDtoWithBasicInfo, files);
  });

  it('calls service.findAll()', async () => {
    await controller.findAll(true, false);

    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
    expect(serviceMock.findAll).toHaveBeenCalledWith({ sortBy: 'name', order: 'asc' }, true, false);
  });

  it('calls service.findOne()', async () => {
    const id = '1';

    await controller.findOne(id);

    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('calls service.update() without images and without basic info', async () => {
    const id = '1';

    await controller.update(id, updateBasicLocationDto);

    expect(serviceMock.update).toHaveBeenCalledWith(id, updateBasicLocationDto, null);
  });

  it('calls service.update() without images and with basic info', async () => {
    const id = '1';

    await controller.update(id, updateDtoWithBasicInfo);

    expect(serviceMock.update).toHaveBeenCalledWith(id, updateDtoWithBasicInfo, null);
  });

  it('calls service.update() with images and without basic info', async () => {
    const id = '1';

    await controller.update(id, updateBasicLocationDto, files);

    expect(serviceMock.update).toHaveBeenCalledWith(id, updateBasicLocationDto, files);
  });

  it('calls service.update() with images and with basic info', async () => {
    const id = '1';

    await controller.update(id, updateDtoWithBasicInfo, files);

    expect(serviceMock.update).toHaveBeenCalledWith(id, updateDtoWithBasicInfo, files);
  });

  it('calls service.remove()', async () => {
    const id = '1';

    await controller.remove(id);

    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });

  it('calls service.removePermanently() with permanent delete', async () => {
    const id = '1';

    await controller.removePermanently(id);

    expect(serviceMock.removePermanently).toHaveBeenCalledWith(id);
  });

  it('calls service.restore()', async () => {
    const id = '1';

    await controller.restore(id);

    expect(serviceMock.restore).toHaveBeenCalledWith(id);
  });
});
