import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Auth
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UnauthorizedPage from './pages/auth/UnauthorizedPage'

// Jobs (public)
import JobsPage from './pages/jobs/JobsPage'
import JobDetailPage from './pages/jobs/JobDetailPage'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfilePage from './pages/student/StudentProfilePage'
import StudentApplicationsPage from './pages/student/StudentApplicationsPage'

// Company
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyProfilePage from './pages/company/CompanyProfilePage'
import CompanyJobsPage from './pages/company/CompanyJobsPage'
import JobFormPage from './pages/company/JobFormPage'
import CompanyApplicationsPage from './pages/company/CompanyApplicationsPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
        </Route>

        {/* Company */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']} />}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
          <Route path="/company/jobs" element={<CompanyJobsPage />} />
          <Route path="/company/jobs/new" element={<JobFormPage />} />
          <Route path="/company/jobs/:jobId/edit" element={<JobFormPage />} />
          <Route path="/company/applications/:jobId" element={<CompanyApplicationsPage />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Route>
    </Routes>
  )
}

export default App
