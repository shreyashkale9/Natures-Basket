import { Star, ThumbsUp } from 'lucide-react';

const ProductReviews = ({ product, user }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        {user && (
          <button className="btn-outline text-sm">
            Write a Review
          </button>
        )}
      </div>
      
      {product.reviews && product.reviews.length > 0 ? (
        <div className="space-y-4">
          {product.reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ThumbsUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
