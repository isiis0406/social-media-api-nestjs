import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
    sub: number,
    email: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService,
        private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            ignoreExpiration: false,
        });
    }
    async validate(payload: Payload) {
        //Trouver l'user
        const user = await this.prismaService.user.findUnique({where:  { email : payload.email}});
        if(!user) throw new UnauthorizedException('Unauthorized');
        Reflect.deleteProperty(user, "password");
        console.log(user);
        return user;
    }
}