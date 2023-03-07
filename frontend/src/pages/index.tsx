import { Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";

function Compo() {
  return (
    <ul>
      <li>
        (IMG:/vite.svg
        <img src="/vite.svg" className="logo" title="/vite.svg" />)
      </li>
      <li>
        (IMG:import reactLogo from "./assets/react.svg"
        <img src={reactLogo} className="logo react" alt="React logo" />)
      </li>
      <li>
        <Link to={"/"}>Root(/)</Link>
      </li>
      <li>
        <Link to={"/compoa"}>Root(/compoa)</Link>
      </li>
      <li>
        <Link to={"/compoA"}>Root(/compoA)</Link>
      </li>
      <li>
        <Link to={"/B"}>Root(/B)</Link>
      </li>
      <li>
        <Link to={"/b"}>Root(/b)</Link>
      </li>
      <li>
        <Link to={"/b/compob"}>Root(/b/compob)</Link>
      </li>
      <li>
        <Link to={"/b/compoB"}>Root(/b/compoB)</Link>
      </li>
      <li>
        <Link to={"/b/1"}>Root(/b/1)</Link>
      </li>
      <li>
        <Link to={"/b/2"}>Root(/b/2)</Link>
      </li>
      <li>
        <Link to={"/b/2/compoC"}>Root(/b/2/compoC)</Link>
      </li>
      <li>
        <Link to={"/b/notfound"}>Root(/b/notfound)</Link>
      </li>
    </ul>
  );
}

export default Compo;
