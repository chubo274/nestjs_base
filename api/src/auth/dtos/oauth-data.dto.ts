import { IsBoolean, IsObject, IsString } from 'class-validator';

// google auth data {
//   iss: 'https://accounts.google.com',
//   azp: '395829564416-v9ij4stbtv3ub4ikqulati7hgh1jvrsc.apps.googleusercontent.com',
//   aud: '395829564416-t3n5arqjvfttclri8d1qvrabpm509jk9.apps.googleusercontent.com',
//   sub: '100534571001226041817',
//   email: 'huynhtuanhuy1996@gmail.com',
//   email_verified: 'true',
//   at_hash: 'WcxLbRJFa8t74qM0VPMTmQ',
//   nonce: '6fV_fHqHgzenLE3P7e2aPqV5M7DDuqi8tExd5UWHKAY',
//   name: 'Huy Huỳnh Tuấn',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocK9WU74DwL5i32cLu6qQk6GW5tRP61aE4djlinL__5ixjc=s96-c',
//   given_name: 'Huy',
//   family_name: 'Huỳnh Tuấn',
//   locale: 'en-GB',
//   iat: '1694679587',
//   exp: '1694683187',
//   alg: 'RS256',
//   kid: '7c0b6913fe13820a333399ace426e70535a9a0bf',
//   typ: 'JWT'
// }
export class GoogleOAuthData {
  @IsString()
  readonly iss?: string;
  
  @IsString()
  readonly azp?: string;
  
  @IsString()
  readonly aud?: string;
  
  @IsString()
  readonly sub?: string;
  
  @IsString()
  readonly email?: string;
  
  @IsString()
  readonly email_verified?: string;
  
  @IsString()
  readonly at_hash?: string;
  
  @IsString()
  readonly nonce?: string;
  
  @IsString()
  readonly name?: string;
  
  @IsString()
  readonly picture?: string;
  
  @IsString()
  readonly given_name?: string;
  
  @IsString()
  readonly family_name?: string;
  
  @IsString()
  readonly locale?: string;
  
  @IsString()
  readonly kid?: string;
}

// facebook auth data {
//   id: '2258991954302403',
//   name: 'Hoàng Hải',
//   first_name: 'Hoàng',
//   last_name: 'Hải',
//   email: 'lhhai1999@gmail.com',
//   picture: {
//     data: {
//       height: 200,
//       is_silhouette: false,
//       url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2258991954302403&height=200&width=200&ext=1697276197&hash=AeSfe5FgMofwp-5uQno',
//       width: 200
//     }
//   }
// }
export class FacebookOAuthData {
  @IsString()
  readonly id?: string;
  
  @IsString()
  readonly name?: string;
  
  @IsString()
  readonly first_name?: string;
  
  @IsString()
  readonly last_name?: string;
  
  @IsString()
  readonly email?: string;
  
  @IsObject()
  readonly picture?: {
    readonly data?: {
      readonly height?: number;
      readonly width?: number;
      readonly is_silhouette?: boolean;
      readonly url?: string;
    };
  };
}

// apple auth data {
//   iss: 'https://appleid.apple.com',
//   aud: 'gotoyou.gotu',
//   exp: 1694769169,
//   iat: 1694682769,
//   sub: '001769.f2cfaa835b9f40cdb9c5e27a7b87679c.0912',
//   nonce: '660d73861e16f35d37bd2dc18d9739a5692e8efd31aa5727a08ef346f402cd22',
//   c_hash: 'UdY6SzQhdeUhHOp8kL09BQ',
//   email: '27wr8mhngn@privaterelay.appleid.com',
//   email_verified: true,
//   is_private_email: true,
//   auth_time: 1694682769,
//   nonce_supported: true,
//   real_user_status: 2
// }
export class AppleOAuthData {
  @IsString()
  readonly iss?: string;
  
  @IsString()
  readonly aud?: string;
  
  @IsString()
  readonly sub?: string;
  
  @IsString()
  readonly nonce?: string;
  
  @IsString()
  readonly c_hash?: string;
  
  @IsString()
  readonly email?: string;
  
  @IsBoolean()
  readonly email_verified?: boolean;
  
  @IsBoolean()
  readonly is_private_email?: boolean;
}