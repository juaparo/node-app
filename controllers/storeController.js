//Incluir mongoDB
const mongoose = require('mongoose');
const Store = mongoose.model('Store');

// Get the view
exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index')
}

//Get add store view
exports.addStore = (req, res) => {
 // console.log('It works');
  res.render('editStore', { title: 'Add Store'});
};

//Create a store
exports.createStore = async (req, res) => {
  const store =  await (new Store(req.body)).save();
  await store.save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

//Get all stores
exports.getStores = async ( req, res ) => {
  // first query to the database for a list of all stores
   const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

//Edit a store
exports.editStore = async (req, res) => {
  //1. Find the store given the ID
  const store = Store.findOne({ _id: req.params.id })
  //2. confirm they are the owner of the store
  //3. Render out the edit form so the user can update their store
};
