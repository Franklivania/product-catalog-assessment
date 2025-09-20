

export default function ProductCard({ data }) {
  return (
    <div
      role="contentinfo"
      aria-label={`${data?.title} product`}
      aria-labelledby={`${data?.title} product`}
      className="relative w-full max-w-xs h-max flex flex-col space-y-3 p-4 border border-slate-400 rounded-xs bg-white"
    >
      <div className="w-full h-full flex-1/2"></div>
      <section className="w-full h-full flex-1/2">
        
      </section>
    </div>
  )
}
