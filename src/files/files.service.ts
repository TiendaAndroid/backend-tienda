import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Servicio para manejar operaciones relacionadas con archivos de productos.
 * 
 * Este servicio proporciona métodos para recuperar rutas de imágenes estáticas de productos.
 * 
 * @author Fidel Bonilla
 */
@Injectable()
export class FilesService {

  /**
   * Obtiene la ruta de una imagen de producto almacenada estéticamente.
   * 
   * Este método construye la ruta completa de una imagen de producto en el servidor.
   * Verifica si la imagen existe y, si no, lanza una excepción.
   * 
   * @param imageName - El nombre de la imagen de producto a buscar.
   * 
   * @returns La ruta completa de la imagen en el sistema de archivos.
   * 
   * @throws {BadRequestException} Si no se encuentra la imagen con el nombre especificado.
   * 
   * @author Fidel Bonilla
   */
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);
    if (!existsSync) {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }
    return path;
  }
}
