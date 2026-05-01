import { motion } from "framer-motion";

const StatCard = ({ title, value, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-6 rounded-2xl shadow-md text-white bg-gradient-to-r ${color}`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {value || 0}
      </h2>
    </motion.div>
  );
};

export default StatCard;