import { NextResponse } from "next/server";

export async function middleware(request, response) {
  const { origin, pathname } = request.nextUrl;
  const session = request.cookies.get("session");
  const loginResult = await fetch(`${origin}/api/auth/login`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });
  const loginResultData = await loginResult.json();
  const user = loginResultData.user;

  switch (pathname) {
    case "/":
      if (loginResult.status !== 200) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      if (!user.class_id) {
        switch (user.role) {
          case "ketua":
            return NextResponse.redirect(
              new URL(`/class/create?uid=${user.uid}`, request.url)
            );
          case "anggota":
            return NextResponse.redirect(
              new URL(`/class/join?uid=${user.uid}`, request.url)
            );
          default:
            return NextResponse.redirect(
              new URL(`/class/join?uid=${user.uid}`, request.url)
            );
        }
      }

      return NextResponse.next();
    case "/auth/login":
    case "/auth/register":
      if (loginResult.status !== 200) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/", request.url));
    default:
      return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
