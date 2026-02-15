import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category } from '@/types/database';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={`/categorie/${category.slug}`}
            className="category-card block p-6 text-center group"
          >
            <motion.div
              className="text-4xl mb-3"
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {category.icon || '📦'}
            </motion.div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
