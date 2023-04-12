import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROFILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'profile_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {        
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false
          },
        },
      },      
    ]),    
    JwtModule.register({
      secret : process.env.PRIVATE_KEY || 'Secret',      
      signOptions : {
        expiresIn : '24h'
      }
    }),
  ],
  controllers: [AppController, ProfileController],
  providers: [],
})
export class AppModule {}
