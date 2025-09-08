import { motion } from 'framer-motion';
import { Leaf, Truck, Shield, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Fresh Organic Produce',
      description: 'Direct from local farmers to your table'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery for fresh vegetables'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: '100% organic and pesticide-free products'
    },
    {
      icon: Users,
      title: 'Support Local Farmers',
      description: 'Help local farmers get fair prices'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Nature's Basket?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to bringing you the freshest organic vegetables while 
            supporting local farmers and sustainable agriculture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
