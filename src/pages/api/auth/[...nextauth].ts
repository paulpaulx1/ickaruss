import NextAuth from "next-auth";

import { authOptions } from "zicarus/server/auth";

export default NextAuth(authOptions);
