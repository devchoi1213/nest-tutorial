import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.user?.id;
        const userRole = this.getUserRole(userId);

        // 컨트롤러 클래스에서 설정한 role 메타데이터와 라우트 핸들러에서 설정한 role 메타데이터 모두 가져온다.
        const roles = this.reflector.getAllAndMerge<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        return roles?.includes(userRole) ?? true;
    }

    private getUserRole(userId: string): string {
        //TODO 디비에서 userId를 통해 role을 가져오기
        return 'admin';
    }
}