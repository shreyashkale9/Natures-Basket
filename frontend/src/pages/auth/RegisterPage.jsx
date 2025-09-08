import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';
import RegisterHeader from '../../components/auth/RegisterHeader';
import RoleSelector from '../../components/auth/RoleSelector';
import BasicInfoForm from '../../components/auth/BasicInfoForm';
import FarmerInfoForm from '../../components/auth/FarmerInfoForm';
import PasswordForm from '../../components/auth/PasswordForm';
import RegisterFooter from '../../components/auth/RegisterFooter';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('customer');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (data) => {
      toast.success(`${selectedRole === 'farmer' ? 'Farmer' : 'Customer'} registration successful!`);
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const onSubmit = (data) => {
    const userData = {
      ...data,
      role: selectedRole
    };
    registerMutation.mutate(userData);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <RegisterHeader />

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

            <div className="space-y-4">
              <BasicInfoForm register={register} errors={errors} />
              <FarmerInfoForm 
                register={register} 
                errors={errors} 
                selectedRole={selectedRole} 
              />
              <PasswordForm 
                register={register} 
                errors={errors} 
                watch={watch} 
              />
            </div>

            <RegisterFooter 
              selectedRole={selectedRole} 
              isPending={registerMutation.isPending} 
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
