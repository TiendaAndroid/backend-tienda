import 'dotenv/config';
import * as joi from 'joi';

// Creación de manejo de variables de entorno para poder ejecutar correctamente el código
// Autor: Fidel Bonilla

// Interface de los valores de las variables de entorno que se quieren recibir
interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
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
    JWT_SECRET: joi.string().required()
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

// Manejo de errores
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Valores de las variables de entorno
const envVars: EnvVars = value;

// Exportar las variables de entorno
export const envs = {
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_user: envVars.DB_USER,
  db_password: envVars.DB_PASSWORD,
  db_name: envVars.DB_NAME,
  jwt_secret: envVars.JWT_SECRET
};
