const flights = require('../repository/flightList');

module.exports = {
  findAll: (req, res) => {
  
    let results = flights;
    const { departure_times, arrival_times, destination, departure } = req.query;

    if (departure_times) {
      results = results.filter(f => f.departure_times === departure_times);
    }
    if (arrival_times) {
      results = results.filter(f => f.arrival_times === arrival_times);
    }
    if (departure) {
      results = results.filter(f => f.departure === departure);
    }
    if (destination) {
      results = results.filter(f => f.destination === destination);
    }

    return res.status(200).json(results);  
  },

  findById: (req, res) => {
 
    const { id } = req.params;
    const flight = flights.find(f => f.uuid === id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    return res.status(200).json([flight]); 
  },


  update: (req, res) => {

    const { id } = req.params;
    const updateData = req.body;
    const flight = flights.find(f => f.uuid === id);

    if (!flight) return res.status(404).json({error: "Flight not found"});

    Object.keys(updateData).forEach(key => {
      if (key !== 'uuid') {
        flight[key] = updateData[key];
      }
    });

    return res.status(200).json(flight);
  },
};
