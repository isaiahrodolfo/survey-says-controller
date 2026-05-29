import { Routes, Route } from "react-router-dom";
import BoardCreator from "./pages/BoardCreator";
import Controller from "./pages/Controller";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<BoardCreator />} />
      <Route path="/controller" element={<Controller />} />
    </Routes>
  );
};

export default App;
