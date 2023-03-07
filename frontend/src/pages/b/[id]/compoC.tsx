import { useLocation } from "react-router";
import { useParams } from "react-router-dom";

function Compo() {
  const { id } = useParams();
  const location = useLocation();
  return (
    <>
      <h2>CompoC :ID ={id}</h2>
      <h3>{location.pathname}</h3>
    </>
  );
}

export default Compo;
