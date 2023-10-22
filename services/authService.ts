import jwtDecode from 'jwt-decode';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { DecodedToken } from 'app/types/global';

// import { refreshToken } from './authService';

const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

export async function login(email: string, password: string) {
  const response = await fetch(
    'http://127.0.0.1:8000/accounts/api/token/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (response.ok) {
    const { access } = await response.json();
    const decodedToken = jwtDecode<DecodedToken>(access);
    decodedToken.jwt = access;
    // console.log(decodedToken);
    if (decodedToken) {
      setCookie(null, 'currentUser', JSON.stringify(decodedToken), {
        maxAge: TOKEN_EXPIRATION_TIME,
        path: '/',
      });
      // console.log("cookies:", parseCookies());
      // setCookie(null, 'refreshToken', refreshToken, {
      //     maxAge: 30 * 24 * 60 * 60, // 30 days
      //     path: '/',
      // });
    }
    return decodedToken;
  } else {
    throw new Error('Failed to login');
  }
}
// export async function refreshAccessToken() {
//     const refreshToken = parseCookies(null).refreshToken;
//     const response = await fetch('/api/token/refresh', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ refreshToken })
//     });

//     if (response.ok) {
//         const { accessToken } = await response.json();
//         const decodedToken = jwtDecode(accessToken);
//         setCookie(null, 'currentUser', JSON.stringify(decodedToken), {
//             maxAge: TOKEN_EXPIRATION_TIME,
//             path: '/',
//         });
//         return accessToken;
//     } else {
//         destroyCookie(null, 'currentUser');
//         destroyCookie(null, 'refreshToken');
//         throw new Error('Failed to refresh access token');
//     }
// }
