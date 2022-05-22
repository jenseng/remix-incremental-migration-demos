import { Route } from "wouter";
import { PageFour } from "./pages/page-4";
import { PageTwo } from "./pages/page-2";

function App() {
  return (
    <div>
      <div>Old app</div>
      <Route path="/page2">
        <PageTwo />
      </Route>
      <Route path="/page4">
        <PageFour />
      </Route>
    </div>
  );
}

export default App;
