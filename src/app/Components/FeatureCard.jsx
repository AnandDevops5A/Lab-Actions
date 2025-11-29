const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-6 rounded-xl border border-neon-blue/30 bg-gray-900/50 hover:border-neon-red/50 transition duration-500 shadow-xl shadow-neon-blue/10 dark:bg-gray-50 dark:border-gray-300 dark:shadow-lg dark:hover:border-neon-blue">
      <Icon className="h-10 w-10 text-neon-red mb-4 dark:text-neon-blue" />
      <h3 className="text-2xl font-bold mb-2 text-white dark:text-gray-900">{title}</h3>
      <p className="text-gray-400 dark:text-gray-600">{description}</p>
    </div>
  );


  export default FeatureCard