import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticket.routes.js";
import { env } from "./config/env.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", ticketRoutes);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
