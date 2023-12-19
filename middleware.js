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

  const headers = new Headers();
  headers.set("x-origin", origin);

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    if (loginResult.status !== 200) {
      return NextResponse.next({ headers });
    }

    headers.set("x-uid", user.uid);
    return NextResponse.redirect(new URL("/", request.url), { headers });
  } else if (
    pathname.startsWith("/class/join") ||
    pathname.startsWith("/class/create")
  ) {
    if (loginResult.status !== 200) {
      return NextResponse.redirect(new URL("/auth/login", request.url), {
        headers,
      });
    }
    headers.set("x-uid", user.uid);

    if (user.class_id) {
      headers.set("x-class-id", user.class_id);
      return NextResponse.redirect(new URL("/", request.url), {
        headers,
      });
    }

    return NextResponse.next({
      headers,
    });
  } else {
    if (loginResult.status !== 200) {
      return NextResponse.redirect(new URL("/auth/login", request.url), {
        headers,
      });
    }

    if (!user.class_id) {
      switch (user.role) {
        case "ketua":
          return NextResponse.redirect(
            new URL(`/class/create?uid=${user.uid}`, request.url),
            { headers }
          );
        case "anggota":
          return NextResponse.redirect(
            new URL(`/class/join?uid=${user.uid}`, request.url),
            { headers }
          );
        default:
          return NextResponse.redirect(
            new URL(`/class/join?uid=${user.uid}`, request.url),
            { headers }
          );
      }
    }

    headers.set("x-uid", user.uid);
    headers.set("x-class-id", user.class_id);
    return NextResponse.next({ headers });
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
