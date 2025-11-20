// import { Navigate } from 'react-router-dom';
// import { Spin } from 'antd';
// import { useEffect, useState } from 'react';

// export default function ProtectedRoute({ children, requiredRole }) {
//   const [isValid, setIsValid] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('role');
//     const userId = localStorage.getItem('userId');

//     console.log(' ProtectedRoute Check:', {
//       hasToken: !!token,
//       userRole,
//       requiredRole,
//       userId
//     });

//     // Check if auth data exists
//     if (!token || !userRole || !userId) {
//       console.log(' No authentication data found');
//       setIsValid(false);
//       setLoading(false);
//       return;
//     }

//     // Check if role matches
//     if (requiredRole && userRole !== requiredRole) {
//       console.log(` Role mismatch. Expected: ${requiredRole}, Got: ${userRole}`);
//       setIsValid(false);
//       setLoading(false);
//       return;
//     }

//     console.log(' Access granted for role:', userRole);
//     setIsValid(true);
//     setLoading(false);
//   }, [requiredRole]);

//   // Loading state
//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//       }}>
//         <Spin size="large" tip="Loading..." />
//       </div>
//     );
//   }

//   // Access denied - redirect to login
//   if (!isValid) {
//     console.log(' Access denied - redirecting to auth');
//     return <Navigate to="/auth" replace />;
//   }

//   // Access granted
//   console.log(' Rendering protected component');
//   return children;
// }
