import request from 'supertest';
import { AuthToken, Login } from '../types/auth';

const podcastalkBaseUrl = "https://tame-violante-ayyildizfatih-50bbd5b4.koyeb.app";


const doLogin = async (data: Login): Promise<AuthToken | null> => {
    const response = await request(podcastalkBaseUrl)
          .post('/api/v1/auth/email/login').send({
            email: data.email,
            password: data.password
          })

    if(response.status === 200) {
        return { 
            accessToken: response.body.token, 
            expiresIn: response.body.tokenExpires, 
            refreshToken: response.body.refreshToken 
        } as AuthToken;
    }

    return null;
};

export { doLogin };