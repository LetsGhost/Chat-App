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
      throw new Error("User not found");
    }
    if (user.password !== password) {
      throw new Error("Password is incorrect");
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      "secretKey"
    );
    
    console.log("Token:", token);

    return token;
  }
}

export default new AuthService();
