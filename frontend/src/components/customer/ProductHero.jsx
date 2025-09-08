import { Leaf, Sparkles, Truck } from 'lucide-react';

const ProductHero = ({ productCount }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Leaf className="w-8 h-8 mr-3" />
          <h1 className="text-4xl md:text-5xl font-bold">Fresh Organic Products</h1>
        </div>
        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
          Discover fresh, organic vegetables and fruits from local farmers. 
          Farm-to-table quality delivered to your doorstep.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold">{productCount}</div>
            <div className="text-green-100">Fresh Products</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-green-100">Organic Certified</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold">24h</div>
            <div className="text-green-100">Fresh Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
