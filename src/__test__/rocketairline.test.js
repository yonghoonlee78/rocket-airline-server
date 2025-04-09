const request = require('supertest');
const app = require('../app');

describe('Flight Router', () => {
  test('GET /flight - 응답은 JSON 문자열이어야 함', async () => {
    const res = await request(app).get('/flight');

    expect(res.text).toBe.not('not implemented');
    expect(() => JSON.parse(res.text)).not.toThrow();
  });

  test('GET /flight - 응답은 배열이어야 함', async () => {
    const res = await request(app).get('/flight');
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /flight - 응답의 첫 객체는 필드를 포함해야 함', async () => {
    const res = await request(app).get('/flight');
    expect(res.body[0]).toEqual({
      uuid: 'af6fa55c-da65-47dd-af23-578fdba40bed',
      departure: 'ICN',
      destination: 'CJU',
      departure_times: '2021-12-02T12:00:00',
      arrival_times: '2021-12-03T12:00:00',
    });
  });

  test('GET /flight with query - 특정 시간 조건에 맞는 객체 반환', async () => {
    const res = await request(app).get(
      '/flight?departure_times=2021-12-03T12:00:00&arrival_times=2021-12-03T12:00:00'
    );

    expect(res.body).toEqual([
      {
        uuid: 'af6fa55c-da65-47dd-af23-578fdba40byd',
        departure: 'ICN',
        destination: 'PUS',
        departure_times: '2021-12-03T12:00:00',
        arrival_times: '2021-12-03T12:00:00',
      },
      {
        uuid: 'af6fa55c-da65-47dd-af23-578fdba44bed',
        departure: 'ICN',
        destination: 'CJU',
        departure_times: '2021-12-03T12:00:00',
        arrival_times: '2021-12-03T12:00:00',
      },
      {
        uuid: 'af6fa55c-da65-47dd-af23-578fdba41bed',
        departure: 'CJU',
        destination: 'ICN',
        departure_times: '2021-12-03T12:00:00',
        arrival_times: '2021-12-03T12:00:00',
      },
    ]);
  });

  test('GET /flight with departure & destination - 조건 일치 객체 반환', async () => {
    const res = await request(app).get('/flight?departure=CJU&destination=ICN');

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('uuid');
    expect(res.body[0]).toHaveProperty('departure', 'CJU');
    expect(res.body[0]).toHaveProperty('destination', 'ICN');
  });

  test('GET /flight/:id - 특정 id의 항공편 객체 반환', async () => {
    const res = await request(app).get(
      '/flight/af6fa55c-da65-47dd-af23-578fdba42bed'
    );

    expect(res.body[0]).toEqual({
      uuid: 'af6fa55c-da65-47dd-af23-578fdba42bed',
      departure: 'CJU',
      destination: 'ICN',
      departure_times: '2021-12-03T12:00:00',
      arrival_times: '2021-12-04T12:00:00',
    });
  });
});

describe('Book Router', () => {
  test('GET /book - 응답은 배열', async () => {
    const res = await request(app).get('/book');
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /book - 예약 등록 후 확인', async () => {
    await request(app).post('/book').send({
      flight_uuid: 'af6fa55c-da65-47dd-af23-578fdba44bed',
      name: 'Alice',
      phone: '010-1234-5678',
    });

    const res = await request(app).get('/book');
    expect(res.body[0]).toEqual({
      flight_uuid: 'af6fa55c-da65-47dd-af23-578fdba44bed',
      name: 'Alice',
      phone: '010-1234-5678',
    });
  });

  test('GET /book?flight_uuid=... - 항공편 예약 조회', async () => {
    await request(app).post('/book').send({
      flight_uuid: 'af6fa55c-da65-47dd-af23-578fdba50bed',
      name: 'Bob',
      phone: '010-4321-5678',
    });

    const res = await request(app).get(
      '/book?flight_uuid=af6fa55c-da65-47dd-af23-578fdba50bed'
    );

    expect(res.body[0]).toEqual({
      flight_uuid: 'af6fa55c-da65-47dd-af23-578fdba50bed',
      name: 'Bob',
      phone: '010-4321-5678',
    });
  });

  test('GET /book?phone=... - 전화번호로 예약 조회', async () => {
    const res = await request(app).get('/book?phone=010-1234-5678');

    expect(res.body).toEqual({
      flight_uuid: 'af6fa55c-da65-47dd-af23-578fdba44bed',
      name: 'Alice',
      phone: '010-1234-5678',
    });
  });

  test('DELETE /book?phone=... - 예약 삭제', async () => {
    const res = await request(app).delete('/book?phone=010-1234-5678');

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((b) => b.phone === '010-1234-5678')).toBeUndefined();
  });
});

describe('Advanced Challenges', () => {
  test('PUT /flight/:id - 항공편 정보 수정', async () => {
    const res = await request(app)
      .put('/flight/af6fa55c-da65-47dd-af23-578fdba99bed')
      .send({
        departure: 'ICN',
        destination: 'CJU',
        departure_times: '2021-12-02T11:00:00',
        arrival_times: '2021-12-04T15:00:00',
      });

    expect(res.body).toEqual({
      uuid: 'af6fa55c-da65-47dd-af23-578fdba99bed',
      departure: 'ICN',
      destination: 'CJU',
      departure_times: '2021-12-02T11:00:00',
      arrival_times: '2021-12-04T15:00:00',
    });
  });
});
