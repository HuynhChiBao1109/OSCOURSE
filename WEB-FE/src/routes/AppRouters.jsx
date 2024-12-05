import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Demo from "../demo/index";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";

import { AccountPage } from "../pages/AdminPage";
import { CourseOutlinePage } from "../pages/CourseOutlinePage/CourseOutlinePage";
import { CoursePage } from "../pages/CoursePage/CoursePage";
import HomePage from "../pages/HomePage/HomePage";
import { LearningCoursePage } from "../pages/LearningCoursePage/LearningCoursePage";
import { MyCertificatePage } from "../pages/MyCertificatePage/MyCertificatePage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { PaymentPage } from "../pages/PaymentPage/PaymentPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { SettingProfilePage } from "../pages/SettingProfilePage/SettingProfilePage";

import { CourseManagement } from "../pages/CourseManagementPage/CourseManagementPage";

import { CourseDetailManagement } from "../pages/CourseManagementPage/CourseDetailManagement/CourseDetailManagement";
import { CreateCoursePage } from "../pages/CourseManagementPage/CreateCoursePage/CreateCoursePage";

import { EditCoursePage } from "../pages/CourseManagementPage/EditCoursePage/EditCoursePage";
import { CoursePurchasedParent } from "../pages/CoursePurchasedParent/CoursePurchasedParent";
import PermissionDeniedPage from "../pages/PermissionDeniedPage/PermissionDeniedPage";
import TransactionPage from "../pages/TransactionPage/TransactionPage";
import { PrivateRoute } from "./PrivateRoute";

const AppRouters = () => {
  return (
    <DefaultLayout>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Navigate to="/course" />} />
        <Route
          path="/demo"
          element={
            <PrivateRoute roles={["user"]}>
              <Demo />
            </PrivateRoute>
          }
        />
        <Route path="/course" element={<CoursePage />} />
        <Route
          path="/course/course-outline/:id"
          element={<CourseOutlinePage />}
        />
        <Route
          path="/setting"
          element={
            <PrivateRoute roles={["user"]}>
              <SettingProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute roles={["user"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        {/* PARENT */}
        <Route
          path="/course-purchased-parent"
          element={
            <PrivateRoute roles={["user", "staff", "admin"]}>
              <CoursePurchasedParent />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment/:id"
          element={
            <PrivateRoute roles={["user", "staff", "admin", "children"]}>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        {/* STUDENT */}
        <Route
          path="/learn-course/:courseId"
          element={
            <PrivateRoute roles={["user", "staff", "parent"]}>
              <LearningCoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-certificate"
          element={
            <PrivateRoute roles={["user", "staff", "admin", "parent"]}>
              <MyCertificatePage />
            </PrivateRoute>
          }
        />
        {/* Staff */}
        <Route
          path="/course-management"
          element={
            <PrivateRoute roles={["user", "children", "parent"]}>
              <CourseManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-transaction"
          element={
            <PrivateRoute roles={["user", "children"]}>
              <TransactionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-account"
          element={
            <PrivateRoute roles={["user", "children", "parent"]}>
              <AccountPage />
            </PrivateRoute>
          }
        />
        {/* Admin */}
        <Route
          path="/create-course"
          element={
            <PrivateRoute roles={["user", "children", "parent", "staff"]}>
              <CreateCoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/course-detail-management/:id"
          element={
            <PrivateRoute roles={["user", "children", "parent", "staff"]}>
              <CourseDetailManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-course/:id"
          element={
            <PrivateRoute roles={["user", "children", "parent", "staff"]}>
              <EditCoursePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/manage-transaction" element={<TransactionPage />} />
        <Route path="/permission-denied" element={<PermissionDeniedPage />} />
        {/* <Route path="/blog-detail/edit/:id" element={<EditBlogPage />} />
        <Route path="/course-purchased" element={<CoursePurchasedPage />} />
       */}
      </Routes>
    </DefaultLayout>
  );
};

export default AppRouters;

// ROUTE CŨ

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Demo from "../demo/index";
// import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
// import { BlogDetailPage } from "../pages/BlogDetailPage/BlogDetailPage";
// import { EditBlogPage } from "../pages/BlogDetailPage/EditBlogPage/EditBlogPage";

// import { AccountPage } from "../pages/AdminPage";
// import { CourseOutlinePage } from "../pages/CourseOutlinePage/CourseOutlinePage";
// import { CoursePage } from "../pages/CoursePage/CoursePage";
// import { CoursePurchasedPage } from "../pages/CoursePurchasedPage/CoursePurchasedPage";
// import HomePage from "../pages/HomePage/HomePage";
// import { LearningCoursePage } from "../pages/LearningCoursePage/LearningCoursePage";
// import { ListBlogPage } from "../pages/ListBlogPage/ListBlogPage";
// import { MyBlogPage } from "../pages/MyBlogPage/MyBlogPage";
// import { MyCertificatePage } from "../pages/MyCertificatePage/MyCertificatePage";
// import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
// import { PaymentPage } from "../pages/PaymentPage/PaymentPage";
// import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
// import { SettingProfilePage } from "../pages/SettingProfilePage/SettingProfilePage";

// import { CourseManagement } from "../pages/CourseManagementPage/CourseManagementPage";

// import { CourseDetailManagement } from "../pages/CourseManagementPage/CourseDetailManagement/CourseDetailManagement";
// import { CreateCoursePage } from "../pages/CourseManagementPage/CreateCoursePage/CreateCoursePage";

// import TransactionPage from "../pages/TransactionPage/TransactionPage";
// import { CoursePurchasedParent } from "../pages/CoursePurchasedParent/CoursePurchasedParent";
// import { EditCoursePage } from "../pages/CourseManagementPage/EditCoursePage/EditCoursePage";

// const AppRouters = () => {
//   return (
//     <DefaultLayout>
//       <Routes>
//         /*User */
//         <Route
//           path="/learn-course/:courseId"
//           element={<LearningCoursePage />}
//         />
//         <Route path="/" element={<HomePage />} />
//         <Route path="/demo" element={<Demo />} />
//         <Route path="/setting" element={<SettingProfilePage />} />
//         <Route path="/course" element={<CoursePage />} />
//         <Route path="/course-purchased" element={<CoursePurchasedPage />} />
//         <Route path="/payment" element={<PaymentPage />} />
//         <Route
//           path="/course/course-outline/:id"
//           element={<CourseOutlinePage />}
//         />
//         <Route path="/course-purchased" element={<CoursePurchasedPage />} />
//         <Route path="/course" element={<CoursePage />} />
//         <Route path="/payment" element={<PaymentPage />} />
//         <Route path="/listblog" element={<ListBlogPage />} />
//         <Route path="/blog-detail/:id" element={<BlogDetailPage />} />
//         <Route path="/my-blog" element={<MyBlogPage />} />
//         <Route path="/my-certificate" element={<MyCertificatePage />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/blog-detail/edit/:id" element={<EditBlogPage />} />
//         /* Admin */
//         <Route path="/manage-account" element={<AccountPage />} />
//         <Route path="/create-course" element={<CreateCoursePage />} />
//         <Route path="/edit-course/:id" element={<EditCoursePage />} />
//         <Route path="/course-management" element={<CourseManagement />} />
//         <Route
//           path="/course-detail-management/:id"
//           element={<CourseDetailManagement />}
//         />
//         <Route path="/learn-course" element={<LearningCoursePage />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/transaction" element={<TransactionPage />} />
//         <Route path="/admin" element={<AccountPage />} />
//         <Route
//           path="/course-purchased-parent"
//           element={<CoursePurchasedParent />}
//         />
//         <Route path="*" element={<NotFoundPage />} />
//         <Route path="/manage-transaction" element={<TransactionPage />} />
//       </Routes>
//     </DefaultLayout>
//   );
// };

// export default AppRouters;
