import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const ProductImageGallery = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-center">
            <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      {/* Additional Images */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-20 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Image {i}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductImageGallery;
