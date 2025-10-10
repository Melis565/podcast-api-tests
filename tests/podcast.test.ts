import request from 'supertest';
import { AuthToken } from '../types/auth';
import { doLogin } from '../utils/auth-utils';

const podcastalkBaseUrl = "https://tame-violante-ayyildizfatih-50bbd5b4.koyeb.app";

describe('Create And Update Podcast Tests', () => {
    let podcastId: string | null = null; // podcastId string veya null olabilir
    let token: AuthToken | null = null;

    beforeAll(async () => {
        token = await doLogin({ email: "test1@example.com", password: "secret" });
        console.log('Token saved !!!')
    });


    it('Should user be able to create and view details', async () => {
        const content = "why do cats sleep too much?";
        const title = "cats";
        const createPodcastResponse = await request(podcastalkBaseUrl)
            .post('/api/v1/podcasts')
            .set('Authorization', `Bearer ${token?.accessToken}`)
            .send({
                content, //content:content
                conversations: [], //TODO
                title
            });
        expect(createPodcastResponse.status).toBe(201);
        podcastId = createPodcastResponse.body.id; // Responstaki podcast id
        const getPodcastByIdResponse = await request(podcastalkBaseUrl)
            //   .get("/api/v1/podcasts/" + podcastId) aşağıdaki bununla aynı
            .get(`/api/v1/podcasts/${podcastId}`);
        expect(getPodcastByIdResponse.body.content).toEqual(content);
        expect(getPodcastByIdResponse.body.title).toEqual(title);
    });

    it('User updates title and title should change', async () => {
        expect(podcastId).not.toBeNull();
        const title = "kitty";
        const updateTitle = await request(podcastalkBaseUrl)
            .patch(`/api/v1/podcasts/${podcastId}`)
            .send({ title })
            .set('Authorization', `Bearer ${token?.accessToken}`);
        expect(updateTitle.status).toBe(200);

        const getPodcastByIdResponse = await request(podcastalkBaseUrl)
            .get(`/api/v1/podcasts/${podcastId}`);
        expect(getPodcastByIdResponse.body.title).toEqual(title);

    });

});

describe('Create And Delete Podcast Tests', () => {
    let podcastId: string | null = null; // podcastId string veya null olabilir
    let token: AuthToken | null = null;

    beforeAll(async () => {
        token = await doLogin({ email: "test1@example.com", password: "secret" });
        console.log('Token saved !!!')
    });

    it('Should user be able to create and view details', async () => {
        const content = "why do cats sleep too much?";
        const title = "cats";
        const createPodcastResponse = await request(podcastalkBaseUrl)
            .post('/api/v1/podcasts')
            .set('Authorization', `Bearer ${token?.accessToken}`)
            .send({
                content, //content:content
                conversations: [], //TODO
                title
            });
        expect(createPodcastResponse.status).toBe(201);
        podcastId = (createPodcastResponse.body.id);
        const getPodcastByIdResponse = await request(podcastalkBaseUrl)
            .get(`/api/v1/podcasts/${podcastId}`);
        expect(getPodcastByIdResponse.status).toBe(200);
        expect(getPodcastByIdResponse.body.id).toEqual(podcastId);
    });

    it("Should delete podcast and check if podcast was deleted", async () => {
        const response = await request(podcastalkBaseUrl)
            .delete(`/api/v1/podcasts/${podcastId}`)
            .set('Authorization', `Bearer ${token?.accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toEqual("DELETED");
        expect(response.body.id).toEqual(`${podcastId}`);

        const afterDeleteResponse = await request(podcastalkBaseUrl)
            .get(`/api/v1/podcasts/${podcastId}`);
        expect(afterDeleteResponse.status).toBe(404);//not found
    })
});
