import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "./role.guard";

@Injectable()
export class RoleOrAuthor extends RolesGuard {
    constructor(protected jwtService : JwtService,
        protected reflector: Reflector) {
     super(jwtService, reflector);
  }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {            

    const req = context.switchToHttp().getRequest();
    try {        
        const authHeader = req.headers.authorization;            
        const bearer = authHeader.split(' ')[0];            
        const token = authHeader.split(' ')[1];
        
        if (bearer !== 'Bearer' || !token){
            throw new UnauthorizedException('Пользователь не авторизован');
        }

        const user = this.jwtService.verify(token);            
        
        if(user.user_id == req.params.id){
            return true;
        }

        return await super.canActivate(context);

    } catch (e) {
        throw new HttpException('Доступ запрещен', HttpStatus.FORBIDDEN);
    }
}
}