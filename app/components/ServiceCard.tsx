export default function ServiceCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-white border rounded p-4 shadow">
      <h3 className="text-lg font-bold text-blue-600">{name}</h3>
      <p className="text-sm text-gray-700 mt-1">{description}</p>
    </div>
  );
}
