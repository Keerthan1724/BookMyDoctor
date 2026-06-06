import MainLayout from "../../layouts/MainLayout";
import {
  aboutFeatures,
  howItWorks,
} from "../../data/publicData";

function About() {
  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              About BookMyDoctor
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              BookMyDoctor is a complete online doctor appointment booking platform that connects patients with trusted healthcare professionals.
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Our platform allows users to explore doctors by specialization, check availability, and book appointments seamlessly. Everything is designed to be simple, fast, and user-friendly.
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {aboutFeatures.map((item, index) => (
              <div key={index} className="bg-cardLight dark:bg-cardDark p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              {howItWorks.map((item, index) => (
                <div key={index} className="bg-cardLight dark:bg-cardDark p-6 rounded-xl">
                  <h3 className="font-medium mb-2">
                    {index + 1}. {item.step}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TECH STACK */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Technology Stack
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Built using React.js, Tailwind CSS, Django REST Framework, MySQL, and Stripe payment integration
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default About;