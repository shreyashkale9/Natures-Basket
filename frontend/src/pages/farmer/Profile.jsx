import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../services/api';
import ProfileCard from '../../components/farmer/ProfileCard';
import ProfileTabs from '../../components/farmer/ProfileTabs';
import ProfileForm from '../../components/farmer/ProfileForm';
import AnalyticsTab from '../../components/farmer/AnalyticsTab';
import SettingsTab from '../../components/farmer/SettingsTab';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries(['user-profile']);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data) => userApi.updatePassword(data),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and view your farm analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard user={user} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <ProfileForm
                user={user}
                register={register}
                errors={errors}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSubmit={handleSubmit(onSubmit)}
                updateProfileMutation={updateProfileMutation}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsTab />}

            {activeTab === 'settings' && (
              <SettingsTab
                register={register}
                onSubmit={handleSubmit(onPasswordSubmit)}
                updatePasswordMutation={updatePasswordMutation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
