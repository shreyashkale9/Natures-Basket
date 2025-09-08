const AdminDashboard = () => {
  console.log('AdminDashboard component is rendering!');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">ADMIN DASHBOARD TEST</h1>
      <p className="text-lg text-gray-700">If you can see this, the component is working!</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
        <p className="text-green-800">✅ AdminDashboard component is rendering successfully!</p>
        <p className="text-sm text-gray-600 mt-2">URL: {window.location.href}</p>
        <p className="text-sm text-gray-600">Path: {window.location.pathname}</p>
      </div>
      
      {/* Test if Layout is working */}
      <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded">
        <h2 className="text-lg font-semibold text-blue-800">Layout Test</h2>
        <p className="text-blue-700">This content should be inside the Layout component</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
