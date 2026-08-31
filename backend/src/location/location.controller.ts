import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LocationDto } from './dto/location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(@Body() locationDto: LocationDto, @UploadedFiles() files?: Express.Multer.File[]) {
    const imageNames = files?.map((file) => file.filename) ?? [];

    return this.locationService.create(locationDto, imageNames);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: LocationDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const imageNames = files?.map((file) => file.filename) ?? [];
    return this.locationService.update(id, dto, imageNames);
  }

  @Get()
  findAll(
    // @Query('sortBy') sortBy: 'name' | 'createdAt' | 'updatedAt',
    // @Query('order') order: 'asc' | 'desc',
    @Query('isOnlyFavoriteFilter') isOnlyFavoriteFilter: boolean,
    @Query('isOnlyDeletedFilter') isOnlyDeletedFilter: boolean,
  ) {
    return this.locationService.findAll(
      // { sortBy, order },
      isOnlyFavoriteFilter,
      isOnlyDeletedFilter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }

  @Delete(':id/permanent')
  removePermanently(@Param('id') id: string) {
    return this.locationService.removePermanently(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.locationService.restore(id);
  }
}
