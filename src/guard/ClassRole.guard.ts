import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class ClassRolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const roles = this.reflector.get<string[]>('roles', context.getClass());    // 클래스 데코레이터는 getHandler가 아닌 getClass를 사용

        console.log('ClassRolesGuard: ', roles)

        return true; // 테스트를 위해 그냥 true를 리턴합니다.
    }
}