import { ProjectController } from '../project.controller';
import { ProjectService } from '../project.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProjectController', () => {
  let controller: ProjectController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls service.create()', async () => {
    const dto = {
      name: 'My Project',
      description: 'Description',
    };

    await controller.create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto, null);
  });

  it('calls service.findAll()', async () => {
    await controller.findAll('name', 'asc');

    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
    expect(serviceMock.findAll).toHaveBeenCalledWith({ sortBy: 'name', order: 'asc' });
  });

  it('calls service.findOne()', async () => {
    const id = '1';

    await controller.findOne(id);

    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('calls service.update()', async () => {
    const id = '1';
    const dto = {
      name: 'Updated Project',
      description: 'Updated Description',
      header: 'new-header.png',
    };

    await controller.update(id, dto);

    expect(serviceMock.update).toHaveBeenCalledWith(id, dto, null);
  });

  it('calls service.remove()', async () => {
    const id = '1';

    await controller.remove(id);

    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });
});
