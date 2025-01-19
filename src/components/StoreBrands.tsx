import { motion } from "framer-motion";

const brands = [
  { name: "Amazon", logo: "/lovable-uploads/amazon.png" },
  { name: "Walmart", logo: "/lovable-uploads/walmart.png" },
  { name: "Costco", logo: "/lovable-uploads/costco.png" },
  { name: "Elloria", logo: "/lovable-uploads/elloria.png" }
];

export const StoreBrands = () => {
  return (
    <section className="w-full py-32 bg-gradient-to-b from-white to-accent-purple/5">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Available At
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Find Elloria products at your favorite retailers
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [-1, 1, -1],
                transition: { rotate: { repeat: Infinity, duration: 2 } }
              }}
              className="w-48 h-48 flex items-center justify-center p-8 rounded-3xl bg-white hover:bg-accent-purple/5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-gray-100"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};