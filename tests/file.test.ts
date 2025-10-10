import request from 'supertest';
import { AuthToken } from '../types/auth';
import { doLogin } from '../utils/auth-utils';

const podcastalkBaseUrl = "https://tame-violante-ayyildizfatih-50bbd5b4.koyeb.app";


describe('File Upload Tests', () => {
    let uploadedFileId: string | null = null; // uploadedFileId string veya null olabilir
    let uploadedFilePath: string | null = null; // uploadedFilePath string veya null olabilir
    let token: AuthToken | null = null;

    beforeAll(async () => {
        token = await doLogin({ email: "test1@example.com", password: "secret" });
        console.log('Token saved !!!')
    });

    it("Should load file", async () => {
        const filePath = "assets/images/selfie.png"
        const uploadFile = await request(podcastalkBaseUrl)
            .post("/api/v1/files/upload")
            .set('Authorization', `Bearer ${token?.accessToken}`)
            .attach('file', filePath);

        expect(uploadFile.status).toBe(201);
        expect(uploadFile.body.file).toHaveProperty('id');
        uploadedFileId = uploadFile.body.file.id;
        expect(uploadFile.body.file).toHaveProperty('path');
        uploadedFilePath = uploadFile.body.file.path;
    })

    it("Should display uploaded file", async () => {

        console.log('uploadedFilePath:',uploadedFilePath)
        const displayFile = await request(podcastalkBaseUrl)
        .get(uploadedFilePath || "")
        expect(displayFile.status).toBe(200);
       
    })
});