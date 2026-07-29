import EmblaCarousel from './EmblaCarousel'
import type { EmblaOptionsType } from 'embla-carousel'
const OPTIONS: EmblaOptionsType = { align: 'start', loop: true }
const SLIDE_COUNT = 4
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

function TrendingSlider() {

    return (
        <div className="w-full md:h-[42vh] flex py-2 flex-col items-start overflow-hidden">
            <h2 className="text-xl px-4 font-thin tracking-tight text-black dark:text-white">Trending Now</h2>
            <div className="w-full py-4">
                <EmblaCarousel slides={SLIDES} options={OPTIONS} />
            </div>
        </div>
    )
}

export default TrendingSlider;
