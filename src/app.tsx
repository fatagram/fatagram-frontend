import { BrowserRouter } from "react-router-dom";
import ContextTree from "./context-tree";
import AppRoutes from "./routes";
import { GlobalDialog } from "./components/organisms/dialog";
import { NotificationListener } from "./features/notifications/components";

const App: React.FC = () => {
  console.log("App rendered");

  return (
    <BrowserRouter>
      <ContextTree>
        <AppRoutes />
        <GlobalDialog />
        <NotificationListener />
      </ContextTree>
    </BrowserRouter>
  );
};

export default App;
