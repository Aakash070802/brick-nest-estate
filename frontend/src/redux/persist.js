const storage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error("Storage getItem error:", err);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error("Storage setItem error:", err);
    }
  },

  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Storage removeItem error:", err);
    }
  },
};

export default storage;
