import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Inject, Param, Post, Put, UseGuards } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { RoleOrAuthor } from './guards/compose.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './guards/role-auth.decorator';
import { RolesGuard } from './guards/role.guard';

@Controller()
export class ProfileController {
  constructor(@Inject('PROFILE_SERVICE') private readonly client : ClientProxy) {}

  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profiles')
    getAllProfiles(){        
      return this.client.send('getProfiles', '');
    }

  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile/:id')
    getProfileById(@Param('id') id : number){        
      return this.client.send('getProfileById', id);
    }

  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('profile')
    addProfile(@Body() createProfileDto){
      return this.client.send('createProfile', createProfileDto);
    }

  @Roles('ADMIN')
  @UseGuards(RoleOrAuthor)
  @Put('profile/:user_id')
    updateProfile(@Param('user_id') id : number, @Body() updateProfileDto){
      updateProfileDto.id = id;
      return this.client.send('updateProfile', updateProfileDto);
    }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('profile/:id')
    deleteProfile(@Param('id') id : number ){      
      return this.client.send('deleteProfile', id);
    }
}