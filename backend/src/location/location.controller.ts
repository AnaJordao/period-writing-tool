import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LocationDto } from './dto/location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseInterceptors(
      FileInterceptor('header', {
        storage: diskStorage({
          destination: './uploads',
  
          filename: (req, file, callback) => {
            const uniqueName = Date.now() + '-' + file.originalname;
  
            callback(null, uniqueName);
          },
        }),
      }),
    )
    create(@Body() dto: LocationDto, @UploadedFile() images?: ) {
      return this.locationService.create(dto, images ? [images.filename] : null);
    }
}
