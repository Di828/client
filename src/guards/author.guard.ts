import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class IsAuthor implements CanActivate{
        
    constructor (private jwtService : JwtService){}

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
            
            return user.user_id == req.params.id;

        } catch (e) {
            throw new HttpException('Доступ запрещен', HttpStatus.FORBIDDEN);
        }
    }
}