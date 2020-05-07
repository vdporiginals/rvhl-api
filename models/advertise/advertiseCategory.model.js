const mongoose = require('mongoose');
const AdvertiseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'please add a category'],
    },
    description: String,
    keywords: {
        type: String,
        default: 'Danh mục quảng cáo hạ long',
    },
    position: {
        type: String,
        enum: ['slider', 'video', 'bannerAdvertise', 'bannerPage']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

AdvertiseCategorySchema.pre('remove', async function (next) {
    console.log(`Advertise being removed from AdvertiseCategory ${this._id}`);
    await this.model('Advertise').deleteMany({
        category: this._id
    });
    next();
});

module.exports = new mongoose.model('AdvertiseCategory', AdvertiseCategorySchema);