import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class HandlerRolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }   // 메타데이터를 다루기 위한 헬퍼 클래스

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.user?.id; // JWT를 검증해서 얻은 유저ID 라고 가정. request.user 객체에서 얻음.
        const userRole = this.getUserRole(userId);

        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        return roles?.includes(userRole) ?? true;
    }

    private getUserRole(userId: string): string {
        //TODO 디비에서 userId를 통해 role을 가져오기
        return 'admin';
    }
}