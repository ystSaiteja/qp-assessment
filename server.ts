// server.ts
import express from "express";
import authRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
