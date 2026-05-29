interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <div className="overflow-hidden bg-gradient-to-br from-rose-50 via-white to-violet-100 py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
