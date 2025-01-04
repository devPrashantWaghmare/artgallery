// components/Testimonials.js
import '../../styles/Testimonials.css';

const Testimonials = () => {
    return (
        <section className="testimonials bg-gray-100 py-20">
            <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">What Our Customers Say</h2>
            <div className="max-w-7xl mx-auto mt-8 text-center">
                <div className="testimonial-card">
                    <blockquote className="text-lg italic text-gray-600">
                        "Amazing quality! I love my new painting, it's perfect!"
                    </blockquote>
                    <p className="mt-4 font-bold text-gray-700">- John Doe</p>
                    <div className="testimonial-rating">
                        &#9733; &#9733; &#9733; &#9733; &#9733; {/* 5 Stars for rating */}
                    </div>
                </div>
                <div className="testimonial-card">
                    <blockquote className="text-lg italic text-gray-600">
                        "Incredible art, fast shipping, and wonderful customer service!"
                    </blockquote>
                    <p className="mt-4 font-bold text-gray-700">- Jane Smith</p>
                    <div className="testimonial-rating">
                        &#9733; &#9733; &#9733; &#9733; &#9734; {/* 4 Stars for rating */}
                    </div>
                </div>
                <div className="testimonial-card">
                    <blockquote className="text-lg italic text-gray-600">
                        "A beautiful addition to my home. Truly a masterpiece!"
                    </blockquote>
                    <p className="mt-4 font-bold text-gray-700">- Sarah Lee</p>
                    <div className="testimonial-rating">
                        &#9733; &#9733; &#9733; &#9733; &#9733; {/* 5 Stars for rating */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
