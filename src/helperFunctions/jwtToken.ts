import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class JwtTokens {
    constructor(private readonly jwtService: JwtService) { }
    
   async generateAccessToken(id: string, email: string, role: string) {
       return await this.jwtService.signAsync({
            sub: id,
            email,
            role
        },
            {
                secret: 'accessSecret',
                expiresIn: '5m'
        })
    }

   async generateRefreshToken(id: string, email: string, role: string) {
       return await this.jwtService.signAsync({
            sub: id,
            email,
            role
        },
            {
                secret: 'refreshSecret',
                expiresIn: '5m'
        })
    }

    async verifyRefreshToken(refreshToken: string) {
        return await this.jwtService.verifyAsync(refreshToken, {
            secret: 'refreshSecret'
        })
    }
}