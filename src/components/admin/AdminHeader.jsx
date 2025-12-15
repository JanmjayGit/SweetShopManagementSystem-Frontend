import { ArrowLeft, Candy, PlusCircle } from 'lucide-react';

const AdminHeader = ({ user, onNavigateBack, onAddSweet }) => {
  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Side - Title and Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <Candy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-gray-600">Welcome back, {user?.username}!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Add Sweet Button */}
          <button
            onClick={onAddSweet}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Sweet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;