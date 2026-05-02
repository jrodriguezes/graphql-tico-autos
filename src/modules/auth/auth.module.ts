import { Module } from '@nestjs/common';
// Modulo que permite generar y verificar JSON Web Tokens (JWT)
// Se usa para firmar el token al hacer login y validarlo en rutas protegidas
import { JwtModule } from '@nestjs/jwt';

// Moddulo que integra Passport.js con NestJS
// Permite utilizar estrategias de autenticacion (como JWT) mediante guards
import { PassportModule } from '@nestjs/passport';

// Estrategia de Passport para validar tokens JWT
// Se encarga de verificar que el token enviado en el header Authorization sea valido
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      // Configura JwtService con estas reglas por defecto para crear y verificar tokens
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
