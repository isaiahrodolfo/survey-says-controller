import { Routes, Route } from "react-router-dom";
import BoardCreator from "./pages/BoardCreator";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<BoardCreator />} />
    </Routes>
  );
};

export default App;
