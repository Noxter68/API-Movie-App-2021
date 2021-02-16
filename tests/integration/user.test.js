const request = require('supertest');
const { User } = require('../../models/user');

let server;

describe('/api/users', () => {
    beforeEach(() => { server = require('../../app'); })
    afterEach( async () => { 
        await server.close();
        await User.remove({}); 
    });

    describe('POST /', () => {
        const exec = async () => {
            return await request(server)
              .post("/api/users")
              .send({ email: 'email1@gmail.com', password: 'cocococo', name:'David' });
          };

          it("should return 400 if user already in db", async () => {

            const user = new User({ email: 'email1@gmail.com', password: 'cocococo', name: 'David1' });
            await user.save();
      
            const res = await exec();
      
            expect(res.status).toBe(400);
          });

          it("should return a user if valid object passed",async () =>{
            const res = await exec();
            expect(res.status).toBe(200);
          })
    });


    describe('GET /', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                {email: 'email1@gmail.com', password: 'cocococo', name: 'David1'},
                {email: 'email2@gmail.com', password: 'cocococo', name: 'David2'}
            ]);

            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);     
            expect(res.body.length).toBe(2);
            expect(res.body.some(u => u.name === 'David1')).toBeTruthy();
            expect(res.body.some(u => u.name === 'David2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a user if valid id is passed.', async () => {
            const user = new User({ email: 'email1@gmail.com', password: 'cocococo', name: 'David1' });
            await user.save();

            const res = await request(server).get('/api/users/' + user._id);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', user.name);
        });


        it('should return  404 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/users/1');
            
            expect(res.status).toBe(404);
        });
    });






});