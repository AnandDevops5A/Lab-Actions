const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="card p-6 rounded-xl border border-neon-blue/30 hover:border-neon-red/50 transition-all duration-300 will-change-transform hover:shadow-lg hover:shadow-neon-blue/20">
      <Icon className="h-10 w-10 text-neon-red mb-4 animate-pulse-subtle" aria-hidden="true" />
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  export default FeatureCard



