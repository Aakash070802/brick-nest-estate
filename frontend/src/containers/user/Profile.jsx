import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserSuccess,
  logOutUserSuccess,
} from "../../redux/features/userSlice";
import {
  updateUser,
  updateAvatar,
  changePassword,
  deleteAccount,
} from "../../services/userService";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileActions from "../../components/profile/ProfileActions";
import PasswordModal from "../../components/profile/PasswordModal";
import DeleteModal from "../../components/profile/DeleteModal";
import ProfileSkeleton from "../../components/skeletons/ProfileSkeleton";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
      });
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updated = await updateUser(form);
      dispatch(updateUserSuccess(updated));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      const updated = await updateAvatar(formData);
      dispatch(updateUserSuccess(updated));
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePassword = async () => {
    try {
      await changePassword(passwords);
      toast.success("Password changed");
      setShowPasswordModal(false);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      dispatch(logOutUserSuccess());
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!currentUser) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen flex justify-center px-4 py-10 bg-[var(--color-background)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md 
        bg-[var(--color-card)] 
        border border-[var(--color-border)] 
        rounded-2xl p-6 
        shadow-lg"
      >
        {/* HEADER */}
        <ProfileHeader
          user={currentUser}
          fileRef={fileRef}
          handleAvatar={handleAvatar}
        />

        {/* FORM */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] mb-3">
            Profile Info
          </h3>

          <ProfileForm
            form={form}
            setForm={setForm}
            handleUpdate={handleUpdate}
            loading={loading}
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] mb-3">
            Actions
          </h3>

          <ProfileActions
            onPassword={() => setShowPasswordModal(true)}
            onDelete={() => setShowDeleteModal(true)}
            onCreateListing={() => navigate("/view-my-lists")}
          />
        </div>

        {/* MODALS */}
        <PasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          passwords={passwords}
          setPasswords={setPasswords}
          onSubmit={handlePassword}
        />

        <DeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </motion.div>
    </div>
  );
};

export default Profile;
