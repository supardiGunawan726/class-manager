export default function Home() {
  return (
    <main>
      <form action="/api/auth/logout" method="post">
        <button>Logout</button>
      </form>
    </main>
  );
}
