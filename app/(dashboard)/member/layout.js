export default async function Layout(props) {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
}
