const DashboardCard = ({ user, items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="relative flex items-center gap-8 px-6 py-6 rounded-lg bg-white dark:bg-cardDark border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full ${item.iconBg}`}
            >
              <Icon className={item.iconColor} size={30} />
            </div>

            <div>
              <p className="text-lg text-black dark:text-white">
                {item.label}
              </p>

              <p className="text-2xl font-semibold mt-1">
                {item.value === "totalSpent" || item.value === "totalEarnings"
                  ? `₹${user[item.value] || 0}`
                  : user[item.value] || 0}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;