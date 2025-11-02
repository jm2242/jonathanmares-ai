export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#111111] dark:text-gray-100">About Me</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          Hi! I'm Jonathan Mares. I'm currently based out of the East Bay in Northern California and am an engineering manager at <a href="https://www.quorum.us/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Quorum</a>.
        </p>
        
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          Originally from Be'er Sheva, Israel, I grew up in New York and spent my college years at Cornell, studying Chemical Engineering and Computer Science. In my free time, I enjoy playing classical and jazz piano, soccer, mountain biking, motorcycles, and pretending to understand wine.
        </p>
        
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          If you'd like to reach me, you can write to me at <a href="mailto:jmares93@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">jmares93@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}

