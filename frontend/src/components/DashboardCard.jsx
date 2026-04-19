import { FaRupeeSign } from "react-icons/fa";

const DashboardCard = ({ user, items }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="surface-card flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 rounded-xl"
          >
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full flex-shrink-0 ${item.iconBg}`}
            >
              <Icon className={item.iconColor} size={22} />
            </div>

            <div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {item.label}
              </p>

              <p className="mt-1 text-lg sm:text-2xl font-semibold flex items-center gap-1">
                {item.value === "totalSpent" ||
                item.value === "totalEarnings" ||
                item.value === "totalRevenue" ? (
                  <>
                    <FaRupeeSign className="text-base sm:text-lg flex-shrink-0" />
                    {user[item.value] || 0}
                  </>
                ) : (
                  user[item.value] || 0
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
