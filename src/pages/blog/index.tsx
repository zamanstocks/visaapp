import React from 'react';
import { Share2, Clock, Calendar, ChevronRight } from 'lucide-react';

const BlogPage = () => {
  const mainPost = {
    title: "UAE eVisa Delays and Restrictions: What You Need to Know",
    date: "March 24, 2024",
    readTime: "4 min read",
    content: `
      Lately, getting a UAE eVisa has become a tougher task with delays and stricter policies. If you're wondering why this is happening and how to handle it, here's what you need to know.

      What's Causing the Delays?

      • System Overload: Technical glitches like website downtime and payment issues are slowing down applications.
      
      • Policy Changes: No more grace periods for overstaying. You either leave on time or pay heavy fines.
      
      • High Demand: The visa amnesty extension till Dec 31, 2024, has led to a flood of applications.
      
      • Tighter Security: Entry rules are stricter, and some countries face extra scrutiny or bans.

      How You Can Avoid Trouble

      • Apply Early: Don't wait till the last moment—plan ahead.
      
      • Check Everything: Double-check your documents for accuracy.
      
      • Stay Informed: Rules change often. Stay updated or rely on experts.
      
      • Go Smart: Use ZipVisa.com's AI-powered system to simplify your application process.

      Why Choose ZipVisa.com?

      At ZipVisa.com, we make things simple. Upload your passport, and our AI tools handle the rest—quick, accurate, and hassle-free.

      Stop worrying about delays. Let us handle the hard part so you can focus on your trip.
    `
  };

  const relatedPosts = [
    {
      title: "UAE Tourist Visa Guide 2024",
      excerpt: "Complete guide for tourist visa applications and requirements.",
      date: "March 22, 2024"
    },
    {
      title: "Dubai Work Visa Updates",
      excerpt: "Latest changes in work visa policies and procedures.",
      date: "March 20, 2024"
    },
    {
      title: "Document Checklist for UAE Visa",
      excerpt: "Essential documents needed for your visa application.",
      date: "March 18, 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Article */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8 border-b pb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {mainPost.title}
              </h1>
              <div className="flex items-center text-gray-600 gap-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {mainPost.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {mainPost.readTime}
                </div>
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {mainPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us Today
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>Website: ZipVisa.com</p>
                <p>Email: support@zipvisa.com</p>
                <p>Phone: +968-78204228</p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{post.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{post.date}</span>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center">
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Apply for Your Visa?
            </h2>
            <p className="text-gray-600 mb-6">
              Start your application now and let our AI-powered system guide you through the process.
            </p>
            <a
              href="/form"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Your Visa Application
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to receive the latest visa updates and travel guides
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
