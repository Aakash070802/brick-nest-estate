import { config } from "./src/config/config.js";
import { app } from "./src/app.js";
import connectDB from "./src/config/database.js";

/**
 * - DB connection
 */
connectDB();

app.listen(config.PORT, () => {
  console.log(`⚙️ Server is running at port ${config.PORT}`);
});
