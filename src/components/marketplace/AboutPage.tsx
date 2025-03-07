import MainNavigation from "./MainNavigation";
import Footer from "./Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNavigation onRegisterClick={() => {}} />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            About LocalMarket
          </h1>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              At LocalMarket, our mission is to empower local sellers and create
              a vibrant marketplace where community members can discover unique
              products and services from trusted local businesses. We believe in
              supporting local economies and fostering connections between
              buyers and sellers in the same neighborhood.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-6">
              LocalMarket was founded in 2023 with a simple idea: to create a
              platform that makes it easy for local businesses to reach
              customers in their area. What started as a small project has grown
              into a thriving marketplace connecting thousands of sellers with
              buyers who value shopping locally.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Community First</h3>
                <p className="text-gray-600">
                  We prioritize building strong local communities and economies
                  through our platform.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">
                  Trust & Transparency
                </h3>
                <p className="text-gray-600">
                  We believe in honest business practices and clear
                  communication between all parties.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We encourage sustainable practices and reducing environmental
                  impact through local commerce.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform to better serve our users
                  and adapt to changing needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-gray-700">
              Whether you're a buyer looking for unique local products or a
              seller wanting to reach more customers in your area, LocalMarket
              is the place for you. Join our growing community today and be part
              of the local commerce revolution.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                {
                  name: "Jane Smith",
                  role: "Founder & CEO",
                  image:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
                },
                {
                  name: "Michael Johnson",
                  role: "CTO",
                  image:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
                },
                {
                  name: "Sarah Williams",
                  role: "Head of Operations",
                  image:
                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80",
                },
                {
                  name: "David Chen",
                  role: "Marketing Director",
                  image:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
