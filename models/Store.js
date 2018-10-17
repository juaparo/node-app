const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true} 
});

//DEFINE INDEXES OF THE SCHEMA  
storeSchema.index({
  name: 'text',
  decription: 'text'
});

//location index
storeSchema.index({ 
  location: '2dsphere'
 });

storeSchema.pre('save', async function(next){
  if(!this.isModified('name')){
    next(); //skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  //find other stores that have a slug of wes, wes1, wes2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx});

  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});


// GET A LIST OF TAGS
storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: {_id: '$tags', count: {$sum: 1} }},
    { $sort: { count: -1 }}
  ]);
};

//find reviews where the stores _id property === reviews store property
storeSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', //which field on the store?
  foreignField: 'store' //which field on the review?
})

//GET A LIST OF REVIEWS
storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    //lookup Stores and populate their reviews
    {   
    $lookup: 
      { 
        from: 'reviews',
        localField: '_id',
        foreignField: 'store', 
        as: 'reviews' 
      }
    }
    //filter for only items that have 2 or more reviews

    //add the average reviews field

    //sort it by our new field, highest reviews first 

    //limit to at most 10

  ])
}

module.exports = mongoose.model('Store', storeSchema);
