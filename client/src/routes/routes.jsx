import {createBrowserRouter} from "react-router-dom";
import Userlayout from "../layouts/Userlayout";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Authlayout from "../layouts/Authlayout";
import Turfpage from "../pages/Turfpage";
import BookingPage from "../pages/BookingPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import Signup from "../pages/SignupPage";
import ManagerDash from "../pages/manager/ManagerDash";

export const routes = createBrowserRouter([
    {
        path: "/",
        element : <Userlayout/>,
        children:[
            {
                path:"",
                element:<Homepage/>
            },
            {
                path:"turfdetails/:id",
                element:<Turfpage/>
            },
            {
                path:"bookingpage/:id",
                element:<BookingPage/>
            },
            {
                path:"payment/success",
                element:<PaymentSuccess/>
            },
            {
                path:"payment/failed",
                element:<PaymentFailed/>
            },

           
        ]
    },
    {
        path: "/",
        element: <Authlayout />,
        children: [
          {
            path: "login",
            element: <Login/>,
          },
          {
            path: "signup",
            element: <Signup/>,
          },
        ],
      },
      {
        path:"/manager",
        element:<Authlayout/>,
        children: [
            {
                path:"login",
                element: <Login role="manager"/>
            },
            {
                path: "dashboard",
                element:<ManagerDash/>
            }
        ]
      }
])