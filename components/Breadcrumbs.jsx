import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <nav className="text-sm text-gray-500 my-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, idx) => (
          <li key={item.href} className="flex items-center">
            {idx > 0 && <span className="mx-2">/</span>}
            {idx < items.length - 1 ? (
              <Link href={item.href} className="hover:text-orange-600">{item.name}</Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 