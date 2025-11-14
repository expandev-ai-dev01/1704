import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* A global header could go here */}
      <main>
        <Outlet />
      </main>
      {/* A global footer could go here */}
    </div>
  );
};
