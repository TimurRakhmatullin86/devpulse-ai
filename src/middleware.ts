import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/developers/:path*",
    "/repos/:path*",
    "/trends/:path*",
    "/roi/:path*",
    "/settings/:path*",
  ],
};
