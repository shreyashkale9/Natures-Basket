import { motion } from 'framer-motion';
import { Users, Leaf, Shield } from 'lucide-react';
import RoleCard from './RoleCard';

const LoginOptionsSection = () => {
  const roles = [
    {
      role: 'customer',
      icon: Users,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      title: 'Customer',
      description: 'Browse and purchase fresh organic vegetables from local farmers',
      benefits: [
        'Browse fresh organic products',
        'Fast delivery to your doorstep',
        'Support local farmers',
        'Quality guaranteed'
      ],
      buttonText: 'Sign Up',
      buttonClass: 'btn-primary',
      loginLink: '/login'
    },
    {
      role: 'farmer',
      icon: Leaf,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      title: 'Farmer',
      description: 'Sell your organic produce directly to customers',
      benefits: [
        'List your organic products',
        'Get fair prices for your produce',
        'Reach more customers',
        'Manage orders easily'
      ],
      buttonText: 'Sign Up',
      buttonClass: 'btn-secondary',
      loginLink: '/login'
    },
    {
      role: 'admin',
      icon: Shield,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
      title: 'Admin',
      description: 'Manage the platform and ensure quality standards',
      benefits: [
        'Monitor platform activity',
        'Approve farmer products',
        'Manage user accounts',
        'View analytics & reports'
      ],
      buttonText: 'Login as Admin',
      buttonClass: 'bg-accent-600 hover:bg-accent-700 text-white btn',
      loginLink: '/login?role=admin'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600">
            Choose your role and start your journey with Nature's Basket
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((roleData, index) => (
            <RoleCard
              key={roleData.role}
              {...roleData}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginOptionsSection;
