import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
      super({
        passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'refreshSecret',
    });
  }
    async validate(req: Request, payload: any) {
        // console.log(req.headers)
        const refreshToken = req.headers.authorization.replace('Bearer', '').trim()
        
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            refreshToken
        };
  }
}
