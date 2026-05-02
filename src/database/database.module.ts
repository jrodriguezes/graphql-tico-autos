// Importa el decorador @Module, que le dice a NestJS que esta clase es un bloque de construccion de la aplicacion.
import { Module } from '@nestjs/common';
// Importa el modulo oficial de Mongoose para NestJS, encargado de gestionar la conexion con la base de datos MongoDB.
import { MongooseModule } from '@nestjs/mongoose';
// ConfigModule carga las variables de mi .env, configservice me permite acceder a ellos
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Cargar el archivo .env globalmente
    // Configuracion async. Espera a que los datos de .env esten disponibles
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inyectamos configservice a useFactory para acceder a las variables de entorno
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
    }),
  ],
})
export class DatabaseModule {}
