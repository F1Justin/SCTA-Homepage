import type { ReactNode } from 'react';
import './responsive-columns.css';

export default function ResponsiveColumns({ cards, className }: { cards: ReactNode[]; className: string }) {
  return ([2, 3] as const).map(count => (
    <div data-masonry-columns={count} className={`responsive-columns w-auto -mx-2 sm:-mx-4 ${className}`} key={count}>
      {Array.from({ length: Math.min(count, cards.length) }, (_, column) => (
        <div className="responsive-column px-2 sm:px-4" key={column}>
          {cards.filter((_, index) => index % count === column)}
        </div>
      ))}
    </div>
  ));
}
