import { Package, DollarSign, TrendingUp } from 'lucide-react';

const AdminStats = ({ sweets }) => {
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity < 10).length;

  const stats = [
    {
      title: "Total Sweets",
      value: totalSweets,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500"
    },
    {
      title: "Total Inventory Value",
      value: `₹${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      borderColor: "border-green-500"
    },
    {
      title: "Low Stock Items",
      value: lowStockItems,
      icon: TrendingUp,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${stat.borderColor} hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <Icon className={`w-8 h-8 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;