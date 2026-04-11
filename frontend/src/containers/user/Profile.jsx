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
import { FaHeart, FaUser, FaList } from "react-icons/fa";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileActions from "../../components/profile/ProfileActions";
import PasswordModal from "../../components/profile/PasswordModal";
import DeleteModal from "../../components/profile/DeleteModal";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";

const tabs = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "favorites", label: "Favorites", icon: <FaHeart /> },
  { id: "listings", label: "Properties", icon: <FaList /> },
];

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");

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
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER + TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold text-[var(--color-foreground)]">
            My Account
          </h1>

          {/* TABS */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);

                  if (tab.id === "favorites") navigate("/favorites");
                  if (tab.id === "listings") navigate("/view-my-lists");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition cursor-pointer
                ${
                  activeTab === tab.id
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "bg-[var(--color-card)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-lg"
        >
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <>
              <ProfileHeader
                user={currentUser}
                fileRef={fileRef}
                handleAvatar={handleAvatar}
              />

              <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                <ProfileForm
                  form={form}
                  setForm={setForm}
                  handleUpdate={handleUpdate}
                  loading={loading}
                />
              </div>

              <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                <ProfileActions
                  onPassword={() => setShowPasswordModal(true)}
                  onDelete={() => setShowDeleteModal(true)}
                  onCreateListing={() => navigate("/view-my-lists")}
                />
              </div>
            </>
          )}
        </motion.div>

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
      </div>
    </div>
  );
};

export default Profile;
