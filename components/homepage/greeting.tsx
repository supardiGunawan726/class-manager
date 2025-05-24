import { User } from "@/lib/firebase/model/user";

type GreetingProps = {
  user: User;
};

export default function Greeting({ user }: GreetingProps) {
  const date = new Date();
  let greeting = "";

  if (date.getHours() < 12) {
    greeting = "Selamat pagi";
  } else if (date.getHours() < 15) {
    greeting = "Selamat siang";
  } else if (date.getHours() < 18) {
    greeting = "Selamat sore";
  } else {
    greeting = "Selamat malam";
  }

  return (
    <h1 className="font-semibold text-4xl">
      {greeting}, {user.name}!
    </h1>
  );
}
