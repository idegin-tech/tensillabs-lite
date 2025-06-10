import AppLayout from "@/components/layouts/app-layouts/AppLayout";
import { Route, Routes } from "react-router-dom";
import TasksAppHomePage from "./home/TasksAppHomePage";
import TaskAppTimeSheetPage from "./time-sheet/TaskAppTimeSheetPage";
import TaskAppNotificationsPage from "./notifications/TaskAppNotificationsPage";
import TasksAppNav from "../components/TasksAppNav";

export default function TaskAppRoutes() {
  return (
    <>
      <AppLayout sideNavContent={<TasksAppNav/>}>
        <Routes>
          <Route path="/" element={<TasksAppHomePage />} />
          <Route path="time-sheet" element={<TaskAppTimeSheetPage />} />
          <Route path="notifications" element={<TaskAppNotificationsPage />} />
        </Routes>
      </AppLayout>
    </>
  )
}
