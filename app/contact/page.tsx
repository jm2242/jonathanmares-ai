export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#111111] dark:text-gray-100">Contact</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-8">
          Feel free to reach out! I'm always interested in connecting with fellow developers, 
          engineers, and motorcycle enthusiasts.
        </p>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#111111] dark:text-gray-100">Get in Touch</h2>
          <p className="text-[#1a1a1a] dark:text-gray-300 mb-4">
            The best way to reach me is through email or social media.
          </p>
          <div className="space-y-2 text-[#1a1a1a] dark:text-gray-300">
            <p>
              <strong>Email:</strong>{' '}
              <a 
                href="mailto:jmares93@gmail.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                jmares93@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

