export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Contact</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          Feel free to reach out! I'm always interested in connecting with fellow developers, 
          engineers, and motorcycle enthusiasts.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Get in Touch</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The best way to reach me is through email or social media.
          </p>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Email:</strong>{' '}
              <a 
                href="mailto:contact@jonathanmares.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                contact@jonathanmares.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

