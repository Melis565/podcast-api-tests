import request from 'supertest';
import {generateRandomString} from '../utils/string-utils'
import { AuthToken } from '../types/auth';
import { doLogin } from '../utils/auth-utils';

const podcastalkBaseUrl = "https://tame-violante-ayyildizfatih-50bbd5b4.koyeb.app";

describe('POST /login tests', () => {
  it('should return ok', async () => {
    const response = await request(podcastalkBaseUrl)
      .post('/api/v1/auth/email/login').send({
        email: "test1@example.com",
        password: "secret"
      })

    expect(response.status).toBe(200);

  });

  it('POST /login should return 422 with error message if password is incorrect', async () => {
    const response = await request(podcastalkBaseUrl)
      .post('/api/v1/auth/email/login').send({
        email: "test1@example.com",
        password: "sifre"
      })

    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('password', "incorrectPassword");

  });

  it('POST /login should return 422 with error message if email is incorrect', async () => {
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/login').send({
      email: "melis@example.com",
      password: "secret"
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('email', "notFound");
  })

  it('POST /login should return 422 with error message if email is empty', async () => {
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/login').send({
      email: "",
      password: "secret"
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('email', "email should not be empty, email must be an email");
  })

  it('POST /login should return 422 with error message if password is empty', async () => {
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/login').send({
      email: "melis@example.com",
      password: ""
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('password', "password should not be empty");
  })

});

describe('POST /register tests', () => {
  it.skip('POST /register should return ok', async () => {
    const response = await request(podcastalkBaseUrl)
      .post('/api/v1/auth/email/login').send({
        email: "test1@example.com",
        password: "secret",
        firstName: "John",
        lastName: "Doe"
      })

    expect(response.status).toBe(200);
  });

  it('POST /register should return 422 with an error message if email is exist', async () => {
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/register').send({
      email: "test1@example.com",
      password: "secret",
      firstName: "John",
      lastName: "Doe"
    })

    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('email', "emailAlreadyExists");
  })

  it('POST /register should return 422 with an error message if password format is incorrect', async () => {
    const randomEmail = generateRandomString();
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/register').send({
      email: randomEmail + "@example.com",
      password: "test",
      firstName: "John",
      lastName: "Doe"
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('password', "password must be longer than or equal to 6 characters");
  })

  it('POST /register should return 422 with an error message if email type is incorrect', async () => {
    const randomEmail = generateRandomString();
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/register').send({
      email: randomEmail,
      password: "test",
      firstName: "John",
      lastName: "Doe"
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('email', "email must be an email");
  })

  it('POST /register should return 422 with an error message if firstName is empty', async () => {
    const randomEmail = generateRandomString();
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/register').send({
      email: randomEmail + "@example.com",
      password: "secret",
      firstName: "",
      lastName: "Doe"
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('firstName', "firstName should not be empty");
  })

  it('POST /register should return 422 with an error message if lastName is empty', async () => {
    const randomEmail = generateRandomString();
    const response = await request(podcastalkBaseUrl).post('/api/v1/auth/email/register').send({
      email: randomEmail + "@example.com",
      password: "secret",
      firstName: "John",
      lastName: ""
    })
    expect(response.status).toBe(422);
    expect(response.body.errors).toHaveProperty('lastName', "lastName should not be empty");
  });

});


describe('GET /me tests', () => {

  let token: AuthToken | null = null;

  beforeAll(async () => {
    token = await doLogin({email: "test1@example.com", password: "secret"});
    console.log('Token saved !!!')
  });

  it('GET /me should return ok', async () => {
    const response = await request(podcastalkBaseUrl)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token?.accessToken}`);

      console.log(response.body);
    expect(response.status).toBe(200);
  });

  it('GET /me should return an object', async () => {

    
    const response = await request(podcastalkBaseUrl)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token?.accessToken}`);

    expect(typeof response.body).toBe("object");
   
  });

  it('GET /me should return an object with a correct type', async () => {
    const response = await request(podcastalkBaseUrl)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token?.accessToken}`);

    console.log('GET /me should return an object with a correct type:',response.body);
    expect(response.body).toBeInstanceOf(Object);

    // Icerisinde bu degerlerin oldiugunu test et ve sadece bu degerlerin oldugunu test et
    // Verify that no additional properties are present
    const allowedProperties = [
      'id', 
      'email', 
      'provider', 
      'socialId', 
      'firstName', 
      'lastName', 
      'createdAt', 
      'updatedAt', 
      'deletedAt', 
      'subscription', 
      'status', 
      'role'
    ];
    const responseProperties = Object.keys(response.body);
    responseProperties.forEach(prop => {
      expect(allowedProperties).toContain(prop);
    });

    expect(typeof response.body.subscription).toBe("object");
    expect(typeof response.body.status).toBe("object");
    expect(typeof response.body.role).toBe("object");

  });

});