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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/common/Modal";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
  });

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
        username: currentUser.username,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  // UPDATE PROFILE
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

  // AVATAR
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

  // PASSWORD
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

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteAccount();
      dispatch(logOutUserSuccess());
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-(--color-bg)">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-(--color-surface) p-6 rounded-2xl shadow-lg"
      >
        {/* AVATAR */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative cursor-pointer"
            onClick={() => fileRef.current.click()}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={currentUser?.avatar || "/default-user.png"}
              className="w-24 h-24 rounded-full object-cover border-2 border-(--color-border)"
            />

            {/* EDIT ICON */}
            <div className="absolute bottom-0 right-0 bg-(--color-primary) p-1.5 rounded-full text-white text-xs">
              <FaEdit />
            </div>
          </div>

          <input type="file" ref={fileRef} onChange={handleAvatar} hidden />
        </div>

        {/* FORM */}
        <div className="mt-6 flex flex-col gap-3">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="p-3 rounded-xl border border-(--color-border) bg-(--color-card)"
            placeholder="Username"
          />

          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 rounded-xl border border-(--color-border) bg-(--color-card)"
            placeholder="Email"
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpdate}
            className="p-3 rounded-xl text-white font-medium"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "Updating..." : "Save Changes"}
          </motion.button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="p-3 rounded-xl border border-(--color-border)"
          >
            Change Password
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-3 rounded-xl text-red-500 border border-red-500/30"
          >
            Delete Account
          </button>

          <button
            onClick={() => navigate("/create-listing")}
            className="p-3 rounded-xl bg-(--color-primary) text-white"
          >
            Create Property Listing
          </button>
        </div>
      </motion.div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal onClose={() => setShowPasswordModal(false)}>
            <h3 className="text-lg font-semibold mb-2 text-(--color-text)">
              Change Password
            </h3>

            <p className="text-sm text-(--color-text-muted) mb-5">
              Keep your account secure by updating your password
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
              />
            </div>

            <button
              onClick={handlePassword}
              className="mt-4 w-full py-3 rounded-xl text-white font-medium"
              style={{ background: "var(--gradient-primary)" }}
            >
              Update Password
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <h3 className="font-semibold mb-3 text-red-500">Delete Account?</h3>
            <p className="text-sm mb-4 text-(--color-text-muted)">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white p-2 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border p-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
