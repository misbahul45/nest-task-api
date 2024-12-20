import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthTypes } from "src/types/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>,
        private authService: AuthService
    ) {
        const config = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret,
            ignoreExpiration: false,
        };
        super(config);
    }

    async validate(payload: AuthTypes.AUTH_JWT_PAYLOAD) {
        const userId = payload.sub;
        return this.authService.validateJwtUser(userId);
    }
}
