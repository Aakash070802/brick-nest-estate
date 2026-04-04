const GoogleButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70 w-full"
    >
      {loading ? "Loading..." : "Continue with Google"}
    </button>
  );
};

export default GoogleButton;
