const reviewModel = require("../model/reviewModel");
const turfModel = require("../model/turfModel");

const addReview = async (req,res)=>{
    try {
        
        const { turfId, rating, comment } = req.body;
        const userId = req.user._id;

        const alreadyReviewed = await reviewModel.findOne({turfId, userId})
        if(alreadyReviewed){
            return res.status(400).json({message: "You have already reviewed this turf"})
        }

        const newReview = new reviewModel( turfId, userId, rating, comment )
        const savedReview = await newReview.save();

        await turfModel.findByIdAndUpdate( turfId, { $push: {reviews: savedReview._id} });

        res.status(201).json(savedReview)

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || ({ message:"Error adding review", error: error.message }) );
    }
}

const getTurfReviews = async (req,res)=>{
    try {
        const turfId = req.params.turfId;
        const reviews = await reviewModel.find({ turfId }).populate('userId','name');

        res.status(200).json(reviews)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || ({ message:"Error fetching reviews", error: error.message }) );
    }
}

const updateReview = async (req,res)=>{
    try {
        const {reviewId}=req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const review = await reviewModel.findOne({ _id: reviewId, userId});
        if (!review) return res.status(404).json({ message: 'Review not found or unautherized'});

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save()

        res.status(200).json({message: 'Review updated', review });

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || ({ message:"Error updating review", error: error.message }) );
    }
}

const deleteReview = async(req, res)=>{
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await reviewModel.findOneAndDelete({ _id: reviewId, userId});
        if(!review) return res.status(404).json({message : 'Review not found or unauthorized'});

        await turfModel.findByIdAndUpdate(review.turfId,{ $pull: { review: review._id}});

        res.status(200).json({ message: 'Review delete successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ message: 'Error deleting review', error: error.message });
    }
}

module.exports = { addReview, getTurfReviews, updateReview, deleteReview }