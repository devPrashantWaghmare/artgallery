// components/CallToAction.js
import '../../styles/CallToAction.css';

const CallToAction = () => {
    return (
        <section className="cta bg-blue-500 text-white py-20 text-center">
            <h2 className="text-3xl font-bold">Ready to Own Unique Art?</h2>
            <p className="mt-4">Join our art community and get exclusive deals on beautiful artworks.</p>
            <button className="cta-button mt-8">Sign Up Now</button>
        </section>
    );
};

export default CallToAction;
