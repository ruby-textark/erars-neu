import fs from "node:fs/promises";

const neuPlugin = () => ({
  name: "neu-auth-server",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // custom handle request...
      if (req.url === "/auth_info") {
        const authInfo = await fs.readFile("./.tmp/auth_info.json");
        res.write(authInfo.toString());
        res.end();
      } else {
        next();
      }
    });
  },
});

export default neuPlugin;
