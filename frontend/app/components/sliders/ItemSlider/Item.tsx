
import EmblaCarousel from './EmblaCarousel'
import type { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'



const OPTIONS: EmblaOptionsType = { align: 'start', loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

function ItemSlider() {
    const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay()])
    return (
        <div className="w-full py-4">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
    )
}

export default ItemSlider;
