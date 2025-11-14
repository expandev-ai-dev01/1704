const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SafeLogin</h1>
        <p className="text-lg text-gray-600">This is the starting point of your application.</p>
        <p className="text-md text-gray-500 mt-2">
          You can start by editing this page in{' '}
          <code className="bg-gray-200 p-1 rounded">src/pages/Home/main.tsx</code>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
