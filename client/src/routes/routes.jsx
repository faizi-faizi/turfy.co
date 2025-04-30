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
import AddTurf from "../pages/manager/AddTurf";
import ManagerTurfDetails from "../pages/manager/ManagerTurfDetails";
import EditTurf from "../pages/manager/EditTurf";
import MyBookings from "../pages/MyBookings";
import BookingDetails from "../pages/BookingDetails";
import EditBooking from "../pages/EditBooking";
import TurfBookings from "../pages/manager/TurfBookings";

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
            {
                path: "bookings",
                element: <MyBookings/>
            },
            {
                path:"booking/:bookingId",
                element: <BookingDetails/>
            },
            {
                path:"booking/:bookingId/edit",
                element: <EditBooking/>
            }

           
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
          }
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
           
        ]
      },
      {
        path: "/manager",
        element:<Userlayout/>,
        children: [
            {
                path: "dashboard",
                element:<ManagerDash/>
            },
            {
                path: "add-turf",
                element:<AddTurf/>
            },
            {
                path: "turf/:id",
                element: <ManagerTurfDetails/>
            },
            {
                path:"edit-turf/:id",
                element:<EditTurf/>
            },
            {
                path:"bookings/:managerId",
                element:<TurfBookings/>
            }
        ]
      }
])