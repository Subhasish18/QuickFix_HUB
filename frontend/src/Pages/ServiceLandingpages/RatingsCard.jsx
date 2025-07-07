import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RatingsCard = () => {
  const ratings = {
    average: 4.7,
    total: 86,
    distribution: [
      { stars: 5, count: 63, percentage: 73 },
      { stars: 4, count: 19, percentage: 22 },
      { stars: 3, count: 3, percentage: 3 },
      { stars: 2, count: 1, percentage: 1 },
      { stars: 1, count: 0, percentage: 0 },
    ],
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <motion.svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill={star <= rating ? '#facc15' : '#e5e7eb'}
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </motion.svg>
    ));
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-6">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Ratings & Reviews
        </motion.h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <motion.div
            className="text-center sm:w-1/3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-indigo-900">{ratings.average}</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(ratings.average))}</div>
            <div className="text-gray-600 text-sm mt-2">{ratings.total} reviews</div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {ratings.distribution.map((item, index) => (
              <motion.div
                key={item.stars}
                className="flex items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center w-12 text-sm text-gray-700">
                  <span>{item.stars}</span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="#facc15"
                    className="bi bi-star-fill ml-1"
                    viewBox="0 0 16 16"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </motion.svg>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  />
                </div>
                <span className="w-10 text-sm text-gray-600">{item.count}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-6 pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">Recent Comments</h3>
          <div className="flex flex-col gap-3">
            {[
              {
                name: 'Alex Williams',
                rating: 5,
                comment: 'Arrived on time and fixed our leak quickly. Very professional and cleaned up afterward.',
              },
              {
                name: 'Taylor Johnson',
                rating: 4,
                comment: 'Good service, fixed our issue but took a bit longer than expected.',
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-indigo-50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{review.name}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-gray-600 mb-0">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RatingsCard;