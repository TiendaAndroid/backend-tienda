import 'dotenv/config';
import * as joi from 'joi';

/**
 * Configuración y validación de las variables de entorno necesarias para la aplicación.
 *
 * Este módulo se encarga de definir y validar las variables de entorno necesarias
 * para que la aplicación funcione correctamente. Si alguna variable obligatoria
 * no está definida o es incorrecta, se lanza un error.
 *
 * @author Fidel Bonilla
 */

// Interface de los valores de las variables de entorno que se quieren recibir
interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  HOST_API: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  STRIPE_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCELL_URL: string;
  STRIPE_ENDPOINT_SECRET: string;
}

// Validación de las variables de entorno
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    HOST_API: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCELL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

// Manejo de errores
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Valores de las variables de entorno
const envVars: EnvVars = value;

/**
 * Exportación de las variables de entorno para su uso en otras partes de la aplicación.
 *
 * Este objeto contiene las variables de entorno necesarias para la configuración de la
 * aplicación, todas ellas validadas y aseguradas de estar presentes.
 */
export const envs = {
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_user: envVars.DB_USER,
  db_password: envVars.DB_PASSWORD,
  db_name: envVars.DB_NAME,
  jwt_secret: envVars.JWT_SECRET,
  host_api: envVars.HOST_API,
  cloudinary_cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: envVars.CLOUDINARY_API_KEY,
  cloudinary_api_secret: envVars.CLOUDINARY_API_SECRET,
  google_client_id: envVars.GOOGLE_CLIENT_ID,
  google_client_secret: envVars.GOOGLE_CLIENT_SECRET,
  google_callback_url: envVars.GOOGLE_CALLBACK_URL,
  stripe_secret: envVars.STRIPE_SECRET,
  stripe_success_url: envVars.STRIPE_SUCCESS_URL,
  stripe_cancell_url: envVars.STRIPE_CANCELL_URL,
  stripe_endpoint_secret: envVars.STRIPE_ENDPOINT_SECRET,
};
