"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUpdateProfileMutation, useUpdatePasswordMutation } from "@/api/redux/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, selectToken } from "@/api/redux/slices/authSlice";
import { API_BASE_URL } from "@/api/redux/apiConfig";

import { PersonalInfoSection } from "./profile-tab-sections/PersonalInfoSection";
import { SecuritySection } from "./profile-tab-sections/SecuritySection";
import { ProfilePictureSection } from "./profile-tab-sections/ProfilePictureSection";

interface ProfileTabProps {
  user: any;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photo, setPhoto] = useState<string>(user?.photo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoto(user.photo || "");
    }
  }, [user]);

  const baseUrl = 'https://property-listing.keenenter.com';

  const getPhotoUrl = (photoStr: string) => {
    if (!photoStr) return "";
    if (photoStr.startsWith('http') || photoStr.startsWith('data:image')) return photoStr;
    if (photoStr.startsWith('/api/')) return `${baseUrl}${photoStr}`;
    return `${API_BASE_URL}/storage/${photoStr}`;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile({
        name,
        email,
        phone,
        photo: photo.startsWith('data:image') ? photo : undefined
      }).unwrap();
      
      if (result.status === 'success') {
        if (token) {
          dispatch(setCredentials({ user: result.data, token: token }));
        }
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const result = await updatePassword({
        password: newPassword,
        password_confirmation: confirmPassword
      }).unwrap();
      
      if (result.status === 'success') {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4 space-y-8">
        <PersonalInfoSection 
          user={user}
          name={name} setName={setName}
          email={email} setEmail={setEmail}
          phone={phone} setPhone={setPhone}
          handleProfileUpdate={handleProfileUpdate}
        />

        <SecuritySection 
          newPassword={newPassword} setNewPassword={setNewPassword}
          confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
          showPasswords={showPasswords} setShowPasswords={setShowPasswords}
          handlePasswordUpdate={handlePasswordUpdate}
          isUpdatingPassword={isUpdatingPassword}
        />
      </div>

      <div className="col-span-3">
        <ProfilePictureSection 
          photo={photo}
          getPhotoUrl={getPhotoUrl}
          handlePhotoClick={handlePhotoClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
      </div>
    </div>
  );
}
