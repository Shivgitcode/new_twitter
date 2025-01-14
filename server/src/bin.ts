import { app } from ".";
import { config } from "dotenv";
config();

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
