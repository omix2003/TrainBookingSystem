import React from 'react';

export default function AboutUs() {
    return (
        <>
            <div className="about-us-section absolute top-full w-full mt-20 flex flex-col items-center justify-center bg-gradient-to-r from-white to-orange-100 p-10" style={{ backgroundImage: 'linear-gradient(135deg,#ffffff, #f97316)' }}>
                <h2 className="text-4xl text-orange-600 font-semibold mb-10">About Us</h2>
                <div className="about-us-content flex flex-wrap justify-around items-center w-full">
                    <div className="text-content w-full md:w-5/12 p-4 mb-6 md:mb-0">
                        <p className="text-lg text-gray-700 mb-4 animate-fadeIn">Welcome to <span className="text-orange-500 font-bold">Yatra.com</span>, where innovation meets excellence. We are a team of dedicated professionals committed to delivering top-notch services and innovative solutions to our clients.</p>
                        <p className="text-lg text-gray-700 mb-4 animate-fadeIn">Our mission is to exceed your expectations by providing exceptional quality and service. We believe in the power of technology to transform businesses and improve lives. Our solutions are designed with the user in mind, ensuring a seamless and enjoyable experience.</p>
                        <p className="text-lg text-gray-700 mb-4 animate-fadeIn">At the heart of our company is a team of passionate and skilled professionals who are driven by a desire to make a positive impact. We work collaboratively to achieve our goals and continuously strive for excellence in everything we do. Meet some of the people who make it all happen:</p>
                    </div>
                    <div className="images-content flex flex-wrap justify-center md:w-5/12">
                        <img className="about-img w-56 h-56 rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:rotate-3 m-2" src="../../../photos\aboutUs_image1.jpg" alt="Team Member 1" />
                        <img className="about-img w-56 h-56 rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:-rotate-3 m-2" src="h../../../photos\aboutUs_image2.jpg" alt="Team Member 2" />
                    </div>
                </div>
                <div className="testimonials w-full flex flex-col items-center mt-10">
                    <h3 className="text-3xl text-orange-600 font-semibold mb-4">What Our Clients Say</h3>
                    <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg mb-6 animate-fadeIn w-10/12 md:w-1/2">
                        <p className="text-gray-700 mb-4">"The team at Yatra.com has been exceptional. Their innovative solutions have transformed our business, and their commitment to excellence is evident in everything they do." - <span className="font-bold text-orange-500">John Doe, CEO of TechCorp</span></p>
                    </div>
                    <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg mb-6 animate-fadeIn w-10/12 md:w-1/2">
                        <p className="text-gray-700 mb-4">"We couldn't be happier with the service provided by Yatra.com . They truly understand our needs and consistently deliver outstanding results." - <span className="font-bold text-orange-500">Jane Smith, Marketing Director at Innovate Inc.</span></p>
                    </div>
                </div>
                <footer className="bg-white text-orange-600 py-8 px-4 absolute top-full w-full">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-semibold">Yatra.com</h2>
                            <p className="text-md">© 2024 Yatra.com. All rights reserved.</p>
                        </div>
                        <div className="flex space-x-8">
                            <a href="#" className="hover:text-orange-400 transition duration-300">Privacy Policy</a>
                            <a href="#" className="hover:text-orange-400 transition duration-300">Terms of Service</a>
                            <a href="#" className="hover:text-orange-400 transition duration-300">Contact Us</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
