import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Truck, Shield, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Fresh Organic
              <span className="text-primary-600"> Vegetables</span>
              <br />
              From Local Farmers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect directly with local farmers and get the freshest organic vegetables 
              delivered to your doorstep. Support sustainable agriculture while enjoying 
              the best quality produce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-4"
              >
                Browse Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/register"
                className="btn-outline text-lg px-8 py-4"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Leaf,
                    title: "Fresh Veggies",
                    description: "Organic & Local"
                  },
                  {
                    icon: Truck,
                    title: "Fast Delivery",
                    description: "Same Day Service"
                  },
                  {
                    icon: Shield,
                    title: "Quality Assured",
                    description: "100% Organic"
                  },
                  {
                    icon: Users,
                    title: "Support Farmers",
                    description: "Fair Trade"
                  }
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white"
                  >
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mb-3">
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm opacity-90">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
