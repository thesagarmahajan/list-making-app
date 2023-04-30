// import EditList from "./views/EditList";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Lists from "./views/Lists";
import EditList from "./views/EditList";


function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<Lists />
    },
    {
      path:"/list/:listId",
      element:<EditList />
    }

  ]);

  return(<>
    <RouterProvider router={router} />

    {/* <div id="detail">
        <Outlet />
    </div> */}
  </>)
  
}

export default App;
