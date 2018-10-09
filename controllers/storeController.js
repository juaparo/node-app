//Incluir mongoDB
const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed'}, false);
    }
  }
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index')
};


exports.addStore = (req, res) => {
 // console.log('It works');
  res.render('editStore', { title: 'Add Store'});
};

//middleware to upload images
exports.upload = multer(multerOptions).single('photo');

//resizing images
exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if( !req.file){
    next(); //skip to the next middleware
    return; //stop running
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createStore = async (req, res) => {
  const store =  await (new Store(req.body)).save();
  await store.save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};


exports.getStores = async ( req, res ) => {
  // first query to the database for a list of all stores
   const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};


exports.editStore = async (req, res) => {
  //1. Find the store given the ID
  const store =  await Store.findOne({ _id: req.params.id }); 
  //2. confirm they are the owner of the store
  //TODO
  //3. Render out the edit form so the user can update their store
  res.render('editStore', {title: `Edit ${store.name}`, store});
};

exports.updateStore = async (req, res) => {
  //set the location data to be a point
  req.body.location.type = 'Point';
  //find and update the store
  const store = await Store.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // con este parametro se devuelve el dato nuevo en vez del viejo
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
  res.redirect(`/stores/${store._id}/edit`);
  // Redirect them the store and tell them it worked
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if(!store) return next();
  res.render('store', { store,  title: store.name});
};

// TAG PAGE FUNCTIONS

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise =  Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });

  // Gets the result of both querys to obtein the stores and tags of stores
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tags', { tags, title: 'Tags', tag, stores});
};
