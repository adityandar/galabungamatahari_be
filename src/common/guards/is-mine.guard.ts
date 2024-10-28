import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";

@Injectable()
export class IsMineGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const route = request.route.path.split('/')[1];
        const paramId = isNaN(parseInt(request.params.id)) ? 0 : parseInt(request.params.id);

        switch (route) {
            case 'messages':
                const message = await this.prismaService.message.findFirst({
                    where: {
                        id: paramId,
                        userId: request.user.sub,
                    },
                });

                return paramId == message?.id;
            default:
                return paramId === request.user.sub;
        }

    }
}