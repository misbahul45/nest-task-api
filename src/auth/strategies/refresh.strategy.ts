import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import refreshConfig from "../config/refresh.config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthTypes } from "src/types/auth.types";
import { REQUEST } from "src/types/web.types";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(
        @Inject(refreshConfig.KEY) private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            secretOrKey: refreshConfiguration.secret,
            ignoreExpiration: false,
            passReqToCallback: true
        });
    }

    async validate(request: REQUEST, payload: AuthTypes.AUTH_JWT_PAYLOAD) {
        const userId = payload.sub;
        const refreshToken = request.body.refreshToken;

        if (!refreshToken || !userId) {
            throw new UnauthorizedException('Refresh token or user ID missing');
        }

        try {
            return await this.authService.validateRefresh(userId, refreshToken);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
