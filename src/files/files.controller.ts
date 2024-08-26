import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { envs } from 'src/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Controlador para manejar operaciones relacionadas con archivos.
 *
 * Este controlador gestiona la carga y recuperación de imágenes de productos en la aplicación.
 *
 * @author Fidel Bonilla
 */
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Recupera una imagen estática de producto por su nombre.
   *
   * @param res - El objeto de respuesta de Express.
   * @param imageName - El nombre de la imagen que se va a recuperar.
   *
   * @returns La imagen solicitada si se encuentra en el servidor.
   *
   * @author Fidel Bonilla
   */
  @Get('products/:imageName')
  findOne(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  /**
   * Carga una imagen de producto.
   *
   * Esta ruta permite la carga de imágenes para productos. Aplica un filtro para permitir solo
   * ciertos tipos de archivos y restringe el tamaño máximo de la imagen.
   *
   * @param file - El archivo de imagen subido.
   *
   * @returns Un objeto con la URL segura donde se puede acceder a la imagen subida.
   *
   * @throws {BadRequestException} Si no se envía ningún archivo o el archivo no es una imagen válida.
   *
   * @author Fidel Bonilla
   */
  @Post('products')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // Permite hasta 10 archivos
      fileFilter: fileFilter,
      limits: { fileSize: 500000 },
      storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          resource_type: 'image',
          folder: 'products',
          transformation: [
            {
              width: 800,
              height: 800,
              crop: 'limit',
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
        } as any,
      }),
    }),
  )
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Send image files');
    }
  
    const secureUrls = files.map(file => file.path);
    return {
      secureUrls,
    };
  }
}
