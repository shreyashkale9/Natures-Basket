import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  viewMode, 
  canAddToCart, 
  onAddToCart 
}) => {
  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
    }>
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          viewMode={viewMode}
          canAddToCart={canAddToCart}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
