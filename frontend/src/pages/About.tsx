import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-12">
      <h3 className="text-2xl font-medium mt-4">About Us</h3>
      <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2"></div>
      <div className="mx-70">
        <div className="my-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold">Welcome to Bookworm</h2>
          <p className="text-2xl mt-8">
            "Bookworm is an independent New York bookstore and language school
            with locations in Manhattan and Brooklyn. We specialize in travel
            books and language classes."
          </p>
        </div>
        <div className="display grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Our Story</h2>
            <p className="text-xl">
              The name Bookworm was taken from the original name for New York
              International Airport, which was renamed JFK in December 1963.
            </p>
            <p className="text-xl">
              Our Manhattan store has just moved to the West Village. Our new
              location is 170 7th Avenue South, at the corner of Perry Street.
            </p>
            <p className="text-xl">
              From March 2008 through May 2016, the store was located in the
              Flatiron District.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Our Vision</h2>
            <p className="text-xl">
              One of the last travel bookstores in the country, our Manhattan
              store carries a range of guidebooks (all 10% off) to suit the
              needs and tastes of every traveller and budget.
            </p>
            <p className="text-xl">
              We believe that a novel or travelogue can be just as valuable a
              key to a place as any guidebook, and our well-read, well-travelled
              staff is happy to make reading recommendations for any traveller,
              book lover, or gift giver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
