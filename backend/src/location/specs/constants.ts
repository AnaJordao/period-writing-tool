import { LocationDto } from '../dto/location.dto';

export const files = [
  { filename: 'image1.png' } as Express.Multer.File,
  { filename: 'image2.png' } as Express.Multer.File,
];

export const filesNames = ['image1.png', 'image2.png'];

// CREATE DTOs

export const createBasicLocationDto: LocationDto = {
  name: 'My Location',
  description: 'Description',
  type: 'Biome',
  isFavorite: false,
};

export const createDtoWithBasicInfo: LocationDto = {
  name: 'My Location',
  description: 'Description',
  type: 'Biome',
  isFavorite: false,
  locationBasicInfo: {
    dimensions: '10x10',
    area: 100,
    condition: 'Good',
    inhabitants: ['Inhabitant 1', 'Inhabitant 2'],
    population: 200,
    items: ['Item 1', 'Item 2'],
    militaryStrength: 'Strong',
  },
};

// UPDATE DTOs

export const updateBasicLocationDto: LocationDto = {
  name: 'Updated Location',
  description: 'Updated Description',
  type: 'Biome',
  isFavorite: true,
};

export const updateDtoWithBasicInfo: LocationDto = {
  name: 'Updated Location',
  description: 'Updated Description',
  type: 'Biome',
  isFavorite: true,
  locationBasicInfo: {
    dimensions: '20x20',
    area: 400,
    condition: 'Excellent',
    inhabitants: ['Inhabitant 3', 'Inhabitant 4'],
    population: 500,
    items: ['Item 3', 'Item 4'],
    militaryStrength: 'Very Strong',
  },
};
