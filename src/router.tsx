import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout, { loader as layoutLoader } from "./components/Layout";
import Login, { action as loginAction, loader as loginLoader } from "./routes/login";
import Signup, { action as signupAction, loader as signupLoader } from "./routes/signup";
import Home, { loader as homeLoader, action as homeAction } from "./routes/home";
import History, { loader as historyLoader } from "./routes/history";
import Campaigns, { loader as campaignsLoader } from "./routes/campaigns";
import AddCampaign, { action as addCampaignAction } from "./routes/add-campaign";
import EditCampaign, { loader as editCampaignLoader, action as editCampaignAction } from "./routes/edit-campaign";
import Day, { loader as dayLoader, action as dayAction } from "./routes/day";
import Profile, { loader as profileLoader, action as profileAction } from "./routes/profile";
import Friends, { loader as friendsLoader, action as friendsAction } from "./routes/friends";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
    action: loginAction
  },
  {
    path: "/signup",
    element: <Signup />,
    loader: signupLoader,
    action: signupAction
  },
  {
    path: "/",
    element: <Layout />,
    loader: layoutLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
        loader: homeLoader,
        action: homeAction,
      },
      {
        path: "history",
        element: <History />,
        loader: historyLoader
      },
      {
        path: "campaigns",
        element: <Campaigns />,
        loader: campaignsLoader
      },
      {
        path: "campaigns/add",
        element: <AddCampaign />,
        action: addCampaignAction
      },
      {
        path: "campaigns/edit/:id",
        element: <EditCampaign />,
        loader: editCampaignLoader,
        action: editCampaignAction
      },
      {
        path: "day/:date",
        element: <Day />,
        loader: dayLoader,
        action: dayAction
      },
      {
        path: "profile",
        element: <Profile />,
        loader: profileLoader,
        action: profileAction
      },
      {
        path: "friends",
        element: <Friends />,
        loader: friendsLoader,
        action: friendsAction
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);
