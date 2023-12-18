import jwt from "jsonwebtoken";

class AuthService {
  db = {
    users: [
      {
        id: 1,
        username: "john",
        password: "123",
      },
      {
        id: 2,
        username: "nils",
        password: "123",
      },
    ],
  };

  async login(username: string, password: string) {
    const user = this.db.users.find((user) => user.username === username);
    if (!user) {
      console.log("User not found");
    }
    if (user?.password !== password) {
      console.log("Password is wrong");
    }

    const token = jwt.sign(
      { username: user?.username, id: user?.id },
      "secret"
    );

    return token;
  }
}

export default new AuthService();
