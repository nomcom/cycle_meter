import { useLocation } from "react-router";

function Compo() {
  const location = useLocation();
  return (
    <>
      <h2>b index</h2>
      <h3>{location.pathname}</h3>
    </>
  );
}

export default Compo;
