/**
 * Filtro de archivos subidos que verifica la validez de la extensión del archivo.
 * 
 * Esta función permite o rechaza archivos basándose en su extensión. Solo se permiten archivos con
 * las extensiones `jpg`, `jpeg`, o `png`.
 * 
 * @param req - El objeto de la solicitud Express.
 * @param file - El archivo subido a través de Multer.
 * @param callback - Función de callback que recibe un error (si lo hay) o un booleano que indica si el archivo es válido.
 * 
 * @returns Un booleano en la función de callback que indica si el archivo tiene una extensión válida.
 * 
 * @throws {Error} Si no se proporciona un archivo, lanza un error indicando que el archivo está vacío.
 * 
 * @author Fidel Bonilla
 */
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png'];
  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(null, false);
};
