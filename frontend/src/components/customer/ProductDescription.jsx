const ProductDescription = ({ product }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
      <p className="text-gray-600 leading-relaxed">{product.description}</p>
      
      {product.nutritionalInfo && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Nutritional Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{product.nutritionalInfo}</pre>
          </div>
        </div>
      )}
      
      {product.storageInstructions && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Storage Instructions</h4>
          <p className="text-gray-600">{product.storageInstructions}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
