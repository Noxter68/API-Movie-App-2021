const request = require('supertest');
const { User } = require('../../models/user');
const { WatchList } = require('../../models/watchlist');
let server;

describe("/api/watchlist", () => {
    beforeEach(() => {
      server = require("../../app");
    });
    afterEach(async () => {
      await User.remove({});
      await server.close();
    });

    let token;  

    beforeEach(() => {
        token = new User().generateAuthToken();
      });

    describe("GET /", () => {
        it('should return a list of movie if valid user id is given', async () => {
            const user = new User({email: 'davidplanchon.68@gmail.com', password: 'cocococo', name:'David'});
            await user.save();

            const res = await request(server)
            .get('/api/watchlist/list/' + user._id)
            .set('x-auth-token', token);
           
            expect(res.status).toBe(200);
        })
    });

    describe("POST /", () => {
        it('should return 404 if invalid body', async () => {
            const user = '6019645f7f2db812e025c0b3';
            const movie = {id: 443344, title: 'Greenland', description: 'a decription', duration: 99, poster_path:"poster_path.jpg", genre: [{id: 1, name: 'Thriller'}]};



            const res = await request(server)
            .post('/api/watchlist')
            .set('x-auth-token', token)
            .send({movie, token, user});
           
            expect(res.status).toBe(404);
        });

        it('should return 400 if invalid user', async () => {
            const user = '6019645f7f2db812e025c0b3';
           
            const res = await request(server)
            .post('/api/watchlist')
            .set('x-auth-token', token)
            .send({user});
           
            expect(res.status).toBe(404);
        })

        it('should return 400 if already a movie in the database', async () => {
            const user = '6019645f7f2db812e025c0b3';
            const movie = new WatchList({id: 443344, user, title: 'Greenland', description: 'a decription', duration: 99, poster_path:"poster_path.jpg", genre: [{id: 1, name: 'Thriller'}]});
            await movie.save();

            const res = await request(server)
            .post('/api/watchlist')
            .set('x-auth-token', token)
            .send({movie});
           
            expect(res.status).toBe(404);
        })
    });
});