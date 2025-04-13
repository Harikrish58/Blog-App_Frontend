import React from "react";

// About component to introduce DevHub and explain its purpose and content
const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About DevHub</h1>

        {/* Introduction paragraph about DevHub */}
        <p className="text-lg mb-4">
          <span className="font-semibold text-pink-500">DevHub</span> is a
          multi-category blog platform designed to inspire, educate, and connect
          curious minds. From cutting-edge tech to meaningful lifestyle insights
          — we’re building a space where knowledge meets creativity.
        </p>

        {/* Mission statement for DevHub */}
        <p className="text-lg mb-4">
          Whether you're a tech enthusiast, a lifelong learner, a wellness
          seeker, or a business-savvy professional, DevHub offers content
          tailored to your passion. Our mission is to make valuable, diverse,
          and engaging content accessible to everyone.
        </p>

        {/* Section header for content coverage */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">📚 What We Cover</h2>

        {/* List of categories covered by DevHub */}
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>
            <span className="font-medium text-violet-500">Technology:</span>{" "}
            Dive into the latest trends, coding tutorials, gadgets, and
            innovations.
          </li>
          <li>
            <span className="font-medium text-violet-500">Health:</span> Explore
            mental wellness, productivity, and healthy habits for the digital
            lifestyle.
          </li>
          <li>
            <span className="font-medium text-violet-500">Lifestyle:</span>{" "}
            Discover personal growth, routines, and experiences from creatives
            and techies.
          </li>
          <li>
            <span className="font-medium text-violet-500">Education:</span>{" "}
            Learn new skills, concepts, and strategies across disciplines.
          </li>
          <li>
            <span className="font-medium text-violet-500">Entertainment:</span>{" "}
            Read about movies, games, music, and digital culture.
          </li>
          <li>
            <span className="font-medium text-violet-500">Business:</span> Get
            insights into startups, tech industry news, and entrepreneurship.
          </li>
          <li>
            <span className="font-medium text-violet-500">Science:</span>{" "}
            Explore discoveries, theories, and discussions around science and
            research.
          </li>
        </ul>

        {/* Paragraph describing the tech stack used to build DevHub */}
        <p className="text-lg mt-6">
          Built with{" "}
          <span className="font-semibold text-purple-400">React</span>,{" "}
          <span className="font-semibold text-purple-400">Tailwind CSS</span>,
          and <span className="font-semibold text-purple-400">Flowbite</span>,
          DevHub delivers a seamless experience with modern UI and dark mode
          support.
        </p>

        {/* Footer copyright message */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} DevHub. Fuel your curiosity. Share
          your voice.
        </p>
      </div>
    </div>
  );
};

export default About;
