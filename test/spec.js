var request = require('supertest');
describe('loading express', function () {
  var server;
  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkN2E1MTRiNWQyYzEyYzc0NDliZTA0MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTU4ODMyODA5NSwiZXhwIjoxNTg4OTMyODk1fQ.HSl4CR1_NBabFIlfrLo26K1_UQ7bpM4sa0m93nuQ7xY"
  beforeEach(function () {
    server = require('../server');
  });
  afterEach(function () {
    server.close();
  });
  it('responds', function testSlash(done) {
    request(server).get('/api/homepage/slider').set('Authorization', 'Bearer ' + token).expect(200, done);
  });
  it('responds', function testSlash(done) {
    request(server).get('/api/homepage/popular-review').set('Authorization', 'Bearer ' + token).expect(200, done);
  });
  it('responds', function testSlash(done) {
    request(server).get('/api/homepage/popular-tour').set('Authorization', 'Bearer ' + token).expect(200, done);
  });
  it('responds', function testSlash(done) {
    request(server).get('/api/homepage/video-banner').set('Authorization', 'Bearer ' + token).expect(200, done);
  });
  it('responds', function testSlash(done) {
    request(server).get('/api/homepage/advertise-banner').set('Authorization', 'Bearer ' + token).expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server).get('/a/a').expect(404, done);
  });
});