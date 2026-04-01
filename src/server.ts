import express from "express";
import cors from "cors";
import { userRouter } from "./api/user";
import { registerRouter } from "./api/register";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/register", registerRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
