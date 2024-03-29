import { Greeting } from "./greeting";

export default function Layout(props) {
  return (
    <main className="px-12 pt-10">
      <header>
        <Greeting />
      </header>
      <div className="grid grid-cols-[3fr_2fr] gap-8 mt-12">
        <div className="grid gap-8">
          {props.children}
          {props.fund}
        </div>
        <div>{props.announcement}</div>
      </div>
    </main>
  );
}
