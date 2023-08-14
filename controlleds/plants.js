const Plants = require('../models/plants');
const Types = require('../models/type');
const { ObjectId } = require('mongodb');

exports.getAllPlants = (req, res, next) => {
  const search = req.query.search ? req.query.search : '';
  Plants.find({})
    .populate('type')
    .then((plants) => {
      if (search !== '') {
        plants = plants.filter((t) => {
          const name = t.name.toLowerCase();
          const searchLower = search.toLowerCase();
          return name.includes(searchLower);
        });
      }
      return res.json({ error: false, data: plants });
    })
    .catch((err) => {
      res.json({ error: true, data: [] });
    });
};

exports.uploadImage = (req, res, next) => {
  const image = req.body.base64;
  const id = req.body.id;
  Plants.findById(id)
    .then((plants) => {
      if (search !== '') {
        plants = plants.filter((t) => {
          const name = t.name.toLowerCase();
          const searchLower = search.toLowerCase();
          return name.includes(searchLower);
        });
      }
      const length = plants.length;
      plants = plants.slice((page - 1) * 12, page * 12);

      return res.json({ data: plants, length: length });
    })

    .catch((err) => {
      res.json({ error: true, data: [] });
    });
};

exports.getDetail = (req, res, next) => {
  const id = req.body.id;
  Plants.findById(id)
    .populate('type')
    .then((plants) => {
      res.json({ error: false, data: plants });
    })
    .catch((err) => {
      res.json({ error: true, data: [] });
    });
};

exports.getTypes = (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : 0;
  const search = req.query.search ? req.query.search : '';
  Types.find({})
    .populate('plants')
    .then((types) => {
      // console.log(types);
      if (search !== '') {
        types = types.filter((t) => {
          const name = t.name.toLowerCase();
          const searchLower = search.toLowerCase();
          return name.includes(searchLower);
        });
      }
      const length = types.length;
      if (page > 0) {
        types = types.slice((page - 1) * 12, page * 12);
      }
      console.log(types);
      return res.json({ data: types, length: length });
    })
    .catch((err) => {
      console.log('fff');
      return res.json({ error: true, data: [] });
    });
};

exports.getType = (req, res, next) => {
  const id = req.body.id;
  Types.findById(id)
    .populate('plants')
    .then((plants) => {
      if (!plants) return res.json({ error: true });
      return res.json({ error: false, data: plants });
    })
    .catch((err) => {
      return res.json({ error: true });
    });
};

exports.addToType = (req, res, next) => {
  const id = ObjectId(req.body.id);
  console.log(id);
};
