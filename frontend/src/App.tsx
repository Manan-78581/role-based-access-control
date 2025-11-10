import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LeadList from './modules/crm/LeadList';
import LeadNew from './pages/crm/LeadNew';
import LeadDetail from './pages/crm/LeadDetail';
import Settings from './pages/Settings';
import Finance from './pages/finance/Finance';
import HR from './pages/hr/HR';

const App: React.FC = () => {
    return (
    <ChakraProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Dashboard />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Analytics />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute requiredPermission="projects:read">
                                    <MainLayout>
                                        <Projects />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/crm"
                            element={
                                <ProtectedRoute requiredPermission="crm:read">
                                    <MainLayout>
                                        <LeadList />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/crm/new"
                            element={
                                <ProtectedRoute requiredPermission="crm:create">
                                    <MainLayout>
                                        <LeadNew />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/crm/leads/:id"
                            element={
                                <ProtectedRoute requiredPermission="crm:read">
                                    <MainLayout>
                                        <LeadDetail />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Settings />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/finance"
                            element={
                                <ProtectedRoute requiredPermission="finance:read">
                                    <MainLayout>
                                        <Finance />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/hr"
                            element={
                                <ProtectedRoute requiredPermission="hr:read">
                                    <MainLayout>
                                        <HR />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
};

export default App;