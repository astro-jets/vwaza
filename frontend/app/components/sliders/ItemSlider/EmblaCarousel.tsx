import type { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const products = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  name: `Basic Tee ${index + 1}`,
  category: index % 2 === 0 ? "T-Shirts" : "Shoes", // example mapping
  price: "Mk15,000",
  image: `/images/clothes/c${index % 8 + 1}.jpg`,
}));

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()])



  return (
    <section className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container space-x-5 w-full pl-8">
          {
            products.length ?
              products.map((track, index) => (
                <img loading='lazy' height={560} width={560} key={index}
                  className="h-full w-full object-cover lg:h-full lg:w-full rounded-2xl"
                  src={`/images/clothes/c${index % 8 + 1}.jpg`} alt="" />
              ))

              :
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="min-w-30 min-h-30  md:w-45 md:h-45 animate-pulse  bg-slate-900 rounded-full"></div>
              ))
          }
        </div>
      </div>

    </section >
  )
}

export default EmblaCarousel
