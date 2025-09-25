import request from 'supertest';
import Register from '../types/auth';
import { generateRandomString } from '../utils/string-utils'

const podcastalkBaseUrl = "https://tame-violante-ayyildizfatih-50bbd5b4.koyeb.app";

describe.skip('POST /login tests', () => {
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
