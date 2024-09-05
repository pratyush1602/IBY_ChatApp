import {createBrowserRouter} from "react-router-dom";

import App from "../App";
import Register from "../component/Register";
import Login from "../component/Login";
import Home from "../component/Home";
import Messagepage from "../component/Messagepage";
import Authlayout from "../layout/Authlayout";
// import Forgot from "../component/Forgot";
import ProtectedRoute from "./ProtectedRoute";


const router = createBrowserRouter([
    {
        path :"/",
        element : <App/>,
        children:[
            {
                path:"register",
                element:<Authlayout><Register/> </Authlayout>
            },
            {
                path:"login",
                element: <Authlayout><Login/></Authlayout>
            },
            {
                path: "/",
                // element: <Home/>,
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
                children :[
                    {
                        path :':userId',
                        // element: <Messagepage/>
                        element: (
                            <ProtectedRoute>
                                <Messagepage />
                            </ProtectedRoute>
                        )
                    }
                ]
            }
        ]
    }
])

export default router