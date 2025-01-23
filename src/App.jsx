import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherReports from './components/reports/TeacherReports';
import AdminDashboard from './components/AdminDashboard';
import PrincipalDashboard from './components/PrincipalDashboard';
import PrincipalReports from './components/reports/PrincipalReports';
import StaffManagement from './components/staff/StaffManagement';
import StaffPerformance from './components/staff/StaffPerformance';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';
import ClassList from './components/classes/ClassList';
import ClassDetails from './components/classes/ClassDetails';
import UserProfile from './components/profile/UserProfile';
import UserManagement from './components/admin/UserManagement';
import AdminClassManagement from './components/admin/ClassManagement';
import AdminReports from './components/admin/Reports';
import AdminSettings from './components/admin/Settings';
import RoleVerification from './components/auth/RoleVerification';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              user ? (
                <Navigate to={`/${user.userType}-dashboard`} />
              ) : (
                <div className="text-center mt-20">
                  <h1 className="text-4xl font-bold mb-8">Welcome to Very Schooly</h1>
                  <div className="space-x-4">
                    <a href="/signup" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                      Sign Up
                    </a>
                    <a href="/login" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                      Login
                    </a>
                  </div>
                </div>
              )
            } />
            <Route
              path="/student-dashboard/*"
              element={
                <PrivateRoute userType="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent-dashboard/*"
              element={
                <PrivateRoute userType="parent">
                  <ParentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard/*"
              element={
                <PrivateRoute userType="teacher">
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard/reports"
              element={
                <PrivateRoute userType="teacher">
                  <TeacherReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard/*"
              element={
                <PrivateRoute userType="admin">
                  <RoleVerification>
                    <AdminDashboard />
                  </RoleVerification>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard/users"
              element={
                <PrivateRoute userType="admin">
                  <RoleVerification>
                    <UserManagement />
                  </RoleVerification>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard/classes"
              element={
                <PrivateRoute userType="admin">
                  <AdminClassManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard/reports"
              element={
                <PrivateRoute userType="admin">
                  <AdminReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard/settings"
              element={
                <PrivateRoute userType="admin">
                  <AdminSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/principal-dashboard/*"
              element={
                <PrivateRoute userType="principal">
                  <PrincipalDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/principal-dashboard/reports"
              element={
                <PrivateRoute userType="principal">
                  <PrincipalReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/principal-dashboard/staff"
              element={
                <PrivateRoute userType="principal">
                  <StaffManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/principal-dashboard/staff/performance/:id?"
              element={
                <PrivateRoute userType="principal">
                  <StaffPerformance />
                </PrivateRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <PrivateRoute>
                  <ClassList />
                </PrivateRoute>
              }
            />
            <Route
              path="/classes/:classId"
              element={
                <PrivateRoute>
                  <ClassDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

