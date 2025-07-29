let booking = [];

function stripBookId(obj) {
  // book_id 필드 제외 후 반환
  const { book_id, ...rest } = obj;
  return rest;
}

module.exports = {
  // [GET] /book
  findById: (req, res) => {
    const { flight_uuid, phone } = req.query;
    let result = booking;

    if (flight_uuid && phone) {
      result = result.filter(b => b.flight_uuid === flight_uuid && b.phone === phone);
    } else if (flight_uuid) {
      result = result.filter(b => b.flight_uuid === flight_uuid);
    } else if (phone) {
      result = result.filter(b => b.phone === phone);
      // phone만 있을 때 단일일 경우
      if (result.length === 1) {
        return res.json(stripBookId(result[0]));
      }
    }

    // 반환 배열도 book_id 빼서!
    return res.json(result.map(stripBookId));
  },

  // [POST] /book
  create: (req, res) => {
    const { flight_uuid, name, phone } = req.body;
    if (!flight_uuid || !name || !phone) {
      return res.status(400).json({ error: '필수 정보가 없습니다.' });
    }
    const book_id = `book_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newBooking = { book_id, flight_uuid, name, phone };
    booking.push(newBooking);
    res.setHeader('Location', `/book/${book_id}`);
    return res.status(201).json({ book_id });
  },

  // [DELETE] /book?phone=xxx
  deleteById: (req, res) => {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'phone 쿼리값 필요' });
    }
    booking = booking.filter(b => b.phone !== phone);
    // 삭제 후 전체 booking 배열 반환 (book_id 뺌)
    return res.status(200).json(booking.map(stripBookId));
  },
};
