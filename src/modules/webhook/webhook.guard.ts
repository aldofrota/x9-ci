import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const webhookSecret = this.configService.get<string>('webhook.secret');

    if (!webhookSecret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (token !== webhookSecret) {
      throw new UnauthorizedException('Invalid webhook token');
    }

    return true;
  }
}
