import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ProcessGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        return true;
    }
}