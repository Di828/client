import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Inject, Param, Post, Put, UseGuards } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { RoleOrAuthor } from './guards/compose.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './guards/role-auth.decorator';
import { RolesGuard } from './guards/role.guard';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private readonly client : ClientProxy) {}

  @Get('/roles/:value')
    getRoleDescription(@Param('value') value : string){
      return this.client.send('getRoleDescription', value);
    }

  @Post('/roles')
    addRoles(@Body() createRoleDto){
      return this.client.send('createRole', createRoleDto);
    }

  @Post('/registration')
    registration(@Body() registrationDto){                                  
      return this.client.send('registration', registrationDto);
    }

    //Endpoint only for tests!
  @Post('/admin/registration')
    adminRegistration(@Body() registrationDto){                
      return this.client.send('adminRegistration', registrationDto);
    }

  @Post('/login')
    login(@Body() loginDto){                
      return this.client.send('login', loginDto);
    }
    
  @UseGuards(RoleOrAuthor)
  @Put('update/:id')
    updateUserById(@Param('id') id : number, @Body() registrationDto) {        
      let updateDto = registrationDto;
      updateDto.id = id;      
      return this.client.send('update', updateDto);        
    }

  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
    getAllUsers(){
      return this.client.send('getUsers', '');
    }
    
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/:id')
  getUserById(@Param('id') id : number){
    return this.client.send('getUserById', id);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/add-role')
  addRoleToUser(@Body() addRoleDto){
    return this.client.send('setRole', addRoleDto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('user/:id')
  deleteUserById(@Param('id') id : number){
    return this.client.send('deleteUser', id);
  }
}