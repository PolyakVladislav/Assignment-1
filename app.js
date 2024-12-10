const initApp = require("./server");
const port = process.env.PORT;


initApp().then((app) => {
  app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
  });
});


