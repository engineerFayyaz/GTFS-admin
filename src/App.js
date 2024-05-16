import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Productlist from "./pages/AllData/Calendar_dates";
import Addcolor from "./pages/UserList";
import Addcat from "./pages/UserDetails";
import Addbrand from "./pages/AllData/Calendar";
import AddCoupon from "./pages/ManageMobileData";
import ViewEnq from "./pages/AllData/Routes_2";
import ViewOrder from "./pages/AllData/Shapes_1";
import AddEdits from "./pages/AllData/Calendar2";
import RegisteredUser from "./pages/RegisteredUser";
import ProductApproval from "./pages/AllData/Routes_1";
import UploadVisitorCheels from "./pages/AccessPermissions/UploadVisitorCheels";
import UploadVisitorGallery from "./pages/AccessPermissions/UserPermission";
import Register from "./pages/Signup";
import Settings from "./pages/Settings";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import UserPermission from "./pages/AccessPermissions/UserPermission";
import UserRole from "./pages/AccessPermissions/UserRole";
import Customization from "./pages/Customization";
import Configration from "./pages/Configration";
import ManageMobileData from "./pages/ManageMobileData";
// import  UploadGTFSFiles  from "./pages/UploadGTFSFiles";
import DeleteMobileData from "./pages/DeleteMobileData";
import Calendar from "./pages/AllData/Calendar";
import CalendarTwo from "./pages/AllData/Calendar2";
import CalendarDates from "./pages/AllData/Calendar_dates";
import RoutesData from "./pages/AllData/Routes_1";
import RoutesData2 from "./pages/AllData/Routes_2";
import Shapes1 from "./pages/AllData/Shapes_1";
import Shapes2 from "./pages/AllData/Shapes_2";
import Stops1 from "./pages/AllData/Stops1";
import Stops2 from "./pages/AllData/Stops2";
import StopsTime1 from "./pages/AllData/StopTimes_1";
import StopsTime2 from "./pages/AllData/StopTimes_2";
import Trips1 from "./pages/AllData/Trips1";
import Trips2 from "./pages/AllData/Trips2";
import VehicleTracking from "./pages/VechicleTracking";
import NotificationForm from "./pages/NotificationForm";
import { UploadGTFSFiles } from "./pages/UploadGTFSFiles";
import PartnersRequest from "./pages/Partners-Request";
import ContactRequest from "./pages/Contact-Request";
import { CalendarWeb } from "./pages/All_Web_Data/calendar_web_dat";
import { CalendarAttributesWeb } from "./pages/All_Web_Data/calendar_attributes_web";
import { CalendarDatesWeb } from "./pages/All_Web_Data/calendar_dates_web";
import { RoutesWebData } from "./pages/All_Web_Data/routes_web_data";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="RegisteredUser" element={<RegisteredUser />} />
          <Route path="enquiries/:id" element={<ViewEnq />} />
          <Route path="Configration" element={<Configration />} />
          <Route path="ManageMobileData" element={<ManageMobileData />} />
          <Route path="coupon/:id" element={<AddCoupon />} />
          <Route path="uploadgtfsfiles" element={<UploadGTFSFiles />} />
          <Route path="DeleteMobileData" element={<DeleteMobileData />} />

          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Add-Edits" element={<AddEdits />} />
          <Route path="User-List" element={<UserList />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="Product-Approval" element={<ProductApproval />} />
          <Route path="category" element={<Addcat />} />
          <Route path="User-Details" element={<UserDetails />} />
          <Route path="Customization" element={<Customization />} />
          <Route path="add-designer" element={<Addbrand />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="AccessPermissions/UserPermission" element={<UserPermission />} />
          <Route path="AccessPermissions/UserRole" element={<UserRole />} />
          <Route path="AccessPermissions/UploadVisitorCheels" element={<UploadVisitorCheels />} />
          <Route path="AccessPermissions/UploadVisitorCheels" element={<UploadVisitorGallery />} />

          <Route path="AllData/Calendar" element={<Calendar />} />
          <Route path="AllData/Calendar2" element={<CalendarTwo />} />
          <Route path="AllData/Calendar_dates" element={<CalendarDates />} />
          <Route path="AllData/RoutesData" element={<RoutesData />} />
          <Route path="AllData/RoutesData2" element={<RoutesData2 />} />
          <Route path="AllData/Shapes" element={<Shapes1 />} />
          <Route path="AllData/Shapes2" element={<Shapes2 />} />
          <Route path="AllData/Stops1" element={<Stops1 />} />
          <Route path="AllData/Stops2" element={<Stops2 />} />
          <Route path="AllData/Stops_Times1" element={<StopsTime1 />} />
          <Route path="AllData/Stops_Times2" element={<StopsTime2 />} />
          <Route path="AllData/Trips1" element={<Trips1 />} />
          <Route path="AllData/Trips2" element={<Trips2 />} />
          <Route path="/admin/Vehicle-Tracking" element={<VehicleTracking/>}/>
          <Route path="/admin/send-notification" element={<NotificationForm/>}/>
          <Route path="/admin/Partners-Request" element={<PartnersRequest/>}/>
          <Route path="/admin/Contact-Request" element={<ContactRequest/>}/>
          <Route path="All_Web_Data/CalendarWeb" element={<CalendarWeb/>}/>
          <Route path="All_Web_Data/Calendar_Attributes_Web" element={<CalendarAttributesWeb/>}/>
          <Route path="All_Web_Data/Calendar_Dates_Web" element={<CalendarDatesWeb/>}/>
          <Route path="All_Web_Data/Routes_Web" element={<RoutesWebData/>}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
