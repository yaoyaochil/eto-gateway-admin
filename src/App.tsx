import {RouterProvider} from "react-router-dom";
import {routes} from "@/router/routes.tsx";

function App() {
  return (
      <div className={"w-screen h-screen"}>
          <RouterProvider router={routes} />
      </div>
  )
}

export default App
