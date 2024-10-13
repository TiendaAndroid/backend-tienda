import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { envs } from 'src/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: envs.google_client_id,
      clientSecret: envs.google_client_secret,
      callbackURL: envs.google_callback_url,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const birthDate = profile._json.birthday; // Este es el campo de cumpleaños si está disponible
    const phoneNumber = profile._json.phoneNumbers
      ? profile._json.phoneNumbers[0].value
      : null;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      birthDate,
      googleId: id,
      phoneNumber,
      accessToken,
    };
    done(null, user);
  }
}
