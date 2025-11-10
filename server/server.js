import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/Auth.js";
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is listening on PORT:${PORT}`);
});
