import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

//Класс, отвечающий, за права доступа пользователя к определенным эндпоинтам, в нем необходимо реализовать функцию canActivate.
//Функция canActivate на вход получает ExecutionContext, возвращает значение типа boolean | Promise<boolean> | Observable<boolean>.
@Injectable()
export class JwtAuthGuard implements CanActivate{
    
    constructor (private jwtService : JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //Получаем request запрс из контекста выполнения
        const req = context.switchToHttp().getRequest();
        try {
            //Получаем заголовок авторизации, он состоит из 2 частей, 1-ая часть тип токена, 2-ая часть сам токен.
            const authHeader = req.headers.authorization;
            //Тип токена bearer (предъявитель), первый объект массива
            const bearer = authHeader.split(' ')[0];
            //Сам токен - второй объект массива
            const token = authHeader.split(' ')[1];
        
            // Если тип токена не соответсвует используемому нами токену или отсутствет сам токен, то пробрасываем ошибку
            if (bearer !== 'Bearer' || !token){
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            //Раскодируем токен
            const user = this.jwtService.verify(token);            
            //Помещаем раскодированного юзера в request и возвращаем из функции true
            req.user = user;
            return true;

        } catch (e) {            
            throw new UnauthorizedException('Пользователь не авторизован');
        }
    }
}