import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationDto } from './dto/location.dto';
import { Location } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(locationDto: LocationDto, images?: string[] | null): Promise<Location> {
    const { locationBasicInfo, ...rest } = locationDto;
    return await this.prisma.location.create({
      data: {
        ...rest,
        ...(images && {
          images: images.map((image) => `/uploads/${image}`),
        }),
        ...(locationBasicInfo && {
          basicInfo: {
            create: locationBasicInfo,
          },
        }),
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
    const { locationBasicInfo, ...rest } = locationDto;
    return this.prisma.location.update({
      where: { id },
      data: {
        ...rest,
        ...(images && {
          images: images.map((image) => `/uploads/${image}`),
        }),
        ...(locationBasicInfo && {
          basicInfo: {
            create: locationBasicInfo,
          },
        }),
      },
      include: {
        basicInfo: true,
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
