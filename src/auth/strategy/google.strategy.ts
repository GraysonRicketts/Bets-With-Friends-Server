import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GOOGLE_OAUTH_CALLBACK, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from 'src/env/env.constants';

interface Profile {
    name: string;
    email: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({   clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: GOOGLE_OAUTH_CALLBACK, 
    scope: ['email'] });
  }

  async validate(accessToken: string, _: string, profile: Profile, done) {
    const { name, email } = profile; 
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });

    const user = {
        email,
        displayName: name,
        accessToken
    }

    done(null, user)
  }
}