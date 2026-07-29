// Import necessary modules
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

// Your Next.js component
function Slider() {
    return (
        <div className="p-1">
            <div className="w-full max-h-[50vh] rounded-2xl flex items-center justify-center overflow-hidden">
                <Carousel
                    showArrows={false}
                    showStatus={false}
                    showIndicators={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={5000} // Set autoplay interval to 5 seconds
                    stopOnHover={true}
                    swipeable={true}
                    emulateTouch={true}
                    dynamicHeight={false}
                    centerMode={false}
                    centerSlidePercentage={100}
                    showThumbs={false}
                    className="relative h-full overflow-hidden rounded-2xl" // Set initial height using Tailwind classes
                >

                    <div className="relative hover-img max-h-[60vh] overflow-hidden">
                        <a href="#">
                            <img className="max-w-full w-full mx-auto object-cover h-80" src="/images/posts/podfest.jpg" alt="Image description" />
                        </a>
                    </div>

                    <div className="relative hover-img max-h-[60vh] overflow-hidden">
                        <a href="#">
                            <img className="max-w-full w-full mx-auto object-cover h-80" src="/images/posts/x3.jpg" alt="Image description" />
                        </a>
                    </div>


                </Carousel>
            </div>
        </div>
    );
}

export default Slider;
