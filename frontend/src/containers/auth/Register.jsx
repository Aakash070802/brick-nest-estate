import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import registerBgImg from "../../assets/register-bg.jpg";
import { registerUser } from "../../services/authService";
import { loginStart, loginFailure } from "../../redux/features/userSlice";
import RegisterForm from "../../components/common/RegisterForm";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    if (e.target.id === "avatar") {
      setFormData({
        ...formData,
        avatar: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    try {
      dispatch(loginStart());

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      await registerUser(data);

      toast.success("Account created successfully 🚀");

      navigate("/login");
    } catch (err) {
      toast.error(err.message); // ✅ clean backend message
      dispatch(loginFailure(null));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg)">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-225 rounded-2xl overflow-hidden"
      >
        <RegisterForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <div className="w-1/2 hidden md:block">
          <img src={registerBgImg} className="h-full w-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
