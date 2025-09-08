import { User, Leaf } from 'lucide-react';

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  const roles = [
    {
      id: 'customer',
      name: 'Customer',
      description: 'Buy fresh produce',
      icon: User
    },
    {
      id: 'farmer',
      name: 'Farmer',
      description: 'Sell your produce',
      icon: Leaf
    }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        I am a:
      </label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelectedRole(role.id)}
            className={`p-3 rounded-xl border-2 transition-all ${
              selectedRole === role.id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium">{role.name}</div>
            <div className="text-xs text-gray-500 mt-1">{role.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
