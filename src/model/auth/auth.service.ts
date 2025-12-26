import { AuthRepository } from "./auth.repository";
import { hashPassword, comparePassword } from "../../middleware/utils/hash";
import { signToken } from "../../middleware/utils/jwt";
import { LoginDto, RegisterDto } from "./auth.types";

export const AuthService = {
  async register(data: RegisterDto) {
    const user = await AuthRepository.findByEmail(data.email);
    if (user) throw new Error("Email already registered");

    const hashed = await hashPassword(data.password);

    const created = await AuthRepository.createUser(
      data.email,
      hashed,
      (data as any).name
    );

    const token = signToken({ id: created.id, email: created.email });

    return {
      id: created.id,
      email: created.email,
      token,
    };
  },

  async login(data: LoginDto) {
    const user = await AuthRepository.findByEmail(data.email);
    console.log(data.email, user);
    if (!user) throw new Error("Invalid credentials");

    const valid = await comparePassword(data.password, user.password);
    console.log(data.password, user.password, valid);
    if (!valid) throw new Error("Invalid credentials");

    const token = signToken({ id: user.id, email: user.email });

    return {
      id: user.id,
      email: user.email,
      token,
    };
  },
};
