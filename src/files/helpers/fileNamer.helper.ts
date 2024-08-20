import { v4 as uuid } from 'uuid';

/**
 * Genera un nombre único para los archivos subidos.
 * 
 * El nombre del archivo se compone de un UUID y la extensión del archivo,
 * lo que garantiza que cada archivo tenga un nombre único.
 * 
 * @param req - El objeto de la solicitud Express.
 * @param file - El archivo subido a través de Multer.
 * @param callback - Función de callback que recibe el error (si lo hay) o el nombre generado del archivo.
 * 
 * @returns El nombre único del archivo, con su extensión.
 * 
 * @throws {Error} Si no se proporciona un archivo, lanza un error indicando que el archivo está vacío.
 * 
 * @author Fidel Bonilla
 */
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;
  callback(null, fileName);
};
