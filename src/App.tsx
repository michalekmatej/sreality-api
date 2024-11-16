import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "@pages/Main/MainPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

// interface IEstate {
//   name: string;
//   price: number;
//   type: 1 | 2 | 3;
//   images: string;
// }

export default App;