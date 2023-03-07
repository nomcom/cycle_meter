import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { Error404 } from "../../../components/elements/common/Error404";
import { RediretIf } from "../../../components/elements/common/RediretIf";

function Compo() {
  const { id } = useParams();
  const location = useLocation();

  const checkId = () => {
    // IDが一致した場合のみ
    return !["1", "2"].includes(String(id));
  };
  return (
    <RediretIf redirectTo={<Error404 />} ifFunc={checkId}>
      <h2>Dinamic Routing :ID ={id}</h2>
      <h3>{location.pathname}</h3>
    </RediretIf>
  );
}

export default Compo;
