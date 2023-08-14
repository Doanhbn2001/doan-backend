const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Type = require('../models/type');
const Plant = require('../models/plants');

const URL = require('../constant').URL;
const IMG_DEFAULT = require('../constant').IMG_DEFAULT;

exports.signUp = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.json({ error: true, mess: 'Email đã tồn tại' });
      }
      return bcrypt
        .hash(req.body.password, 12)
        .then((hasshedPassword) => {
          const user = new User({
            email: req.body.email,
            password: hasshedPassword,
            plant_notes: { plant_notes: [] },
            isAdmin: false,
          });
          return user.save();
        })
        .then(() => {
          res.json({ erorr: false, mess: 'Đăng ký tài khoản thành công' });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.signIn = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((admin) => {
      if (!admin) {
        return res.json({ errorEmail: true });
      } else {
        if (!admin.isAdmin) {
          return res.json({ errorEmail: true });
        }
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

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {});
  res.clearCookie('connect.sid');
  res.json({ error: false });
};

exports.signInUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({ errorEmail: true });
      } else {
        bcrypt.compare(req.body.password, user.password).then((doMatch) => {
          if (!doMatch) {
            return res.json({ errorPassword: true });
          } else {
            req.session.adminId = String(user._id);
            return res.json({ user: user });
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
  console.log(req.body);
  const id = req.body.id;
  Type.findById(id)
    .then((type) => {
      if (!type) {
        return res.json({ error: true, mess: 'Lỗi server!! Vui lòng thử lại' });
      }
      if (type.plants.length !== 0) {
        return res.json({ error: true, mess: 'Không thể xóa họ thực vật này' });
      }
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
    longitude,
    latitude,
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
        longitude: longitude,
        atitude: latitude,
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
    longitude,
    latitude,
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
              plant.longitude = longitude;
              plant.latitude = latitude;
              plant.img1 = img1;
              plant.img2 = img2;
              type.plants.push(id);
              type.save();
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

exports.getData = (req, res, next) => {
  const id = req.body.id;
  User.findById(id)
    .populate('plant_notes.plant_notes.plant')
    // // .execPopulate()
    .then((user) => {
      if (!user)
        return res.json({
          error: true,
          mess: 'Co loi xay ra! Lam on dang nhap lai',
        });
      return res.json({ error: false, data: user.plant_notes });
    })
    .catch((err) => {
      return res.json({
        error: true,
        mess: 'Co loi xay ra! Lam on dang nhap lai',
      });
    });
};

exports.addNote = (req, res, next) => {
  const id = req.body.idUser;
  const plantId = req.body.idPlant;
  const note = req.body.note;
  Plant.findById(plantId)
    .then((plant) => {
      if (!plant)
        return res.json({
          error: true,
          mess: 'Co loi xay ra. Vui long dang nhap lai',
        });
      User.findById(id)
        .then((user) => {
          return user.addToNote(plant._id, note);
        })
        .then(() => {
          return res.json({ error: false });
        });
    })
    .catch((err) => {
      return res.json({
        error: true,
        mess: 'Co loi xay ra. Vui long dang nhap lai',
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const id = req.body.idUser;
  const plantId = req.body.idPlant;
  Plant.findById(plantId)
    .then((plant) => {
      if (!plant)
        return res.json({
          error: true,
          mess: 'Co loi xay ra. Vui long dang nhap lai',
        });
      User.findById(id)
        .then((user) => {
          return user.deleteNote(plant._id);
        })
        .then(() => {
          return res.json({ error: false });
        });
    })
    .catch((err) => {
      return res.json({
        error: true,
        mess: 'Co loi xay ra. Vui long dang nhap lai',
      });
    });
};
