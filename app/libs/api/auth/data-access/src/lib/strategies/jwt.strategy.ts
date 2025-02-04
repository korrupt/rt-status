import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthConfigService } from '@app/auth-config';
import { AclService, AuthUser } from '@app/acl-data-access';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: AuthConfigService,
    private aclService: AclService,
  ) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return new AuthUser(this.aclService, {
      sub: payload.sub,
      roles: payload.roles,
    });
  }
}
