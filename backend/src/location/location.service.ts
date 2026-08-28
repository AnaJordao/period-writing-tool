import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationBasicInfoDto, LocationDto } from './dto/location.dto';
import { Location } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLocationDto: LocationDto,
    createLocationBasicInfoDto: LocationBasicInfoDto,
    images?: string[] | null,
  ): Promise<Location> {
    return await this.prisma.location.create({
      data: {
        ...createLocationDto,
        ...(images && {
          images: images.map((image) => `/uploads/${image}`),
        }),

        basicInfo: {
          create: {
            ...createLocationBasicInfoDto,
          },
        },
      },
      include: {
        basicInfo: true,
      },
    });
  }

  findAll(
    // { sortBy, order }: LocationSorting,
    isOnlyFavoriteFilter: boolean,
    isOnlyDeletedFilter: boolean,
  ): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: {
        deletedAt: isOnlyDeletedFilter ? { not: null } : null,
        isFavorite: isOnlyFavoriteFilter ? true : undefined,
      },
      // orderBy: {
      //   [sortBy]: order,
      // },
    });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, locationDto: LocationDto, images?: string[] | null) {
    return this.prisma.location.update({
      where: { id },
      data: {
        ...locationDto,
        ...(images && {
          images: images.map((image) => `/uploads/${image}`),
        }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.location.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  removePermanently(id: string) {
    return this.prisma.location.delete({
      where: { id },
    });
  }

  restore(id: string) {
    return this.prisma.location.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
