const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const loggerMiddleware = require("./middleware/logger");
const errorMiddleware = require("./middleware/routeError");
const booksRouter = require("./routes/booksRoute");
const authRouter = require("./routes/authRoute");

const { API } = require("./constants");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(loggerMiddleware);

app.use('/public', express.static(__dirname+"/public"));

app.use(`${API}/user`, authRouter);
app.use(`${API}/books`, booksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
