exports.homePage = (req, res) => {
  
  console.log(req.name);
  res.render('index')
}

exports.addStore = (req, res) => {
 // console.log('It works');
  res.render('editStore', { title: 'Add Store'});
};
