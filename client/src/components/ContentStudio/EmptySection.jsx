'use client';

export default function EmptySection({ message }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl py-10 px-6 text-center">
      <p className="text-sm text-highlight">{message}</p>
    </div>
  );
}