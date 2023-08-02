const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Type = require('../models/type');
const Plant = require('../models/plants');

const URL = require('../constant').URL;
const IMG_DEFAULT = require('../constant').IMG_DEFAULT;

exports.signIn = (req, res, next) => {
  //   bcrypt
  //     .hash(req.body.password, 12)
  //     .then((hasshedPassword) => {
  //       const user = new User({
  //         email: req.body.email,
  //         password: hasshedPassword,
  //       });
  //       return user.save();
  //     })
  //     .then(() => {
  //       res.json({ ok: true });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  User.findOne({ email: req.body.email })
    .then((admin) => {
      if (!admin) {
        return res.json({ errorEmail: true });
      } else {
        bcrypt.compare(req.body.password, admin.password).then((doMatch) => {
          if (!doMatch) {
            return res.json({ errorPassword: true });
          } else {
            req.session.adminId = String(admin._id);
            return res.json({ admin: admin });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addType = (req, res, next) => {
  const type = req.body.type;
  Type.find({ name: type })
    .then((types) => {
      if (types.length !== 0) {
        return res.json({ error: true, mess: 'Họ loại thực vật đã tồn tại!!' });
      }
      const newType = new Type({ name: type, plants: [] });
      newType
        .save()
        .then((t) => {
          return res.json({
            eror: false,
            mess: 'Thêm họ thực vât thành công!!',
          });
        })
        .catch((err) => {
          return res.json({ error: true, mess: 'Lỗi server!!' });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: true, mess: 'Lỗi server!!' });
    });
};

exports.deleteType = (req, res, next) => {
  const id = req.body.id;
  Type.findById(id)
    .then((type) => {
      if (!type) {
        return res.json({ error: true, mess: 'Lỗi server!! Vui lòng thử lại' });
      }
      if (type.plants.length !== 0)
        return res.json({ error: true, mess: 'Không thể xóa họ thực vật này' });
      res.json({ error: false, mess: 'Xóa họ thực vật thành công!!' });
      return Type.deleteOne({ _id: id });
    })
    .catch((err) => {
      console.log('ff', err);
      return res.json({ error: true, mess: 'Lỗi server!! Vui lòng thử lại' });
    });
};

exports.addPlant = (req, res, next) => {
  const {
    name,
    type,
    family,
    description,
    shape_p,
    size_p,
    surface_p,
    aperture_p,
    exine_p,
    structure_p,
  } = req.body;
  let img1 = '';
  let img2 = '';
  req.files.forEach((f) => {
    if (f.fieldname === 'img1') img1 = URL + f.destination + f.filename;
    if (f.fieldname === 'img2') img2 = URL + f.destination + f.filename;
  });
  if (img1 === '') img1 = IMG_DEFAULT;
  if (img2 === '') img2 = IMG_DEFAULT;
  Type.findById(type)
    .then((type) => {
      const plant = new Plant({
        name: name,
        type: type._id,
        family: family,
        description: description,
        img1: img1,
        img2: img2,
        shape_p: shape_p,
        size_p: size_p,
        surface_p: surface_p,
        aperture_p: aperture_p,
        exine_p: exine_p,
        structure_p: structure_p,
      });
      type.plants.push(plant._id);
      type.save();
      return plant.save();
    })
    .then((result) => {
      res.json({ error: false, mess: 'Thêm thực vật thành công !!' });
    })
    .catch((err) => {
      res.json({ error: true, mess: 'Lỗi server' });
    });
};

exports.deletePlant = (req, res, next) => {
  const id = req.body.id;
  Plant.findById(id)
    .then((plant) => {
      return Type.findById(plant.type);
    })
    .then((type) => {
      const newPlants = type.plants.filter((p) => {
        return p.toString() !== id;
      });
      type.plants = newPlants;
      return type.save();
    })
    .then((result) => {
      return Plant.deleteOne({ _id: id });
    })
    .then((result) => {
      return res.json({ error: false, mess: 'Thanh cong' });
    })
    .catch((err) => {
      return res.json({ error: true, mess: 'Loi server' });
    });
};

exports.editPlant = (req, res, next) => {
  const {
    name,
    type,
    oldType,
    oldImg1,
    oldImg2,
    family,
    description,
    shape_p,
    size_p,
    surface_p,
    aperture_p,
    exine_p,
    structure_p,
    id,
  } = req.body;
  let img1 = '';
  let img2 = '';
  req.files.forEach((f) => {
    if (f.fieldname === 'img1') img1 = URL + f.destination + f.filename;
    if (f.fieldname === 'img2') img2 = URL + f.destination + f.filename;
  });
  if (img1 === '') img1 = oldImg1;
  if (img2 === '') img2 = oldImg2;
  Type.findById(oldType)
    .then((type) => {
      const newPlants = type.plants.filter((t) => {
        return t.toString() !== id;
      });
      type.plants = newPlants;
      return type.save();
    })
    .then((result) => {
      Type.findById(type)
        .then((type) => {
          Plant.findById(id)
            .then((plant) => {
              plant.type = type._id;
              plant.name = name;
              plant.family = family;
              plant.description = description;
              plant.shape_p = shape_p;
              plant.size_p = size_p;
              plant.surface_p = surface_p;
              plant.aperture_p = aperture_p;
              plant.exine_p = exine_p;
              plant.structure_p = structure_p;
              plant.img1 = img1;
              plant.img2 = img2;
              type.plants.push(id);
              return plant.save();
            })
            .then((plant) => {
              return res.json({ error: false, mess: 'Thanh cong' });
            });
        })
        .catch((error) => {
          return res.json({ error: true, mess: 'Loi server' });
        });
    });
};
