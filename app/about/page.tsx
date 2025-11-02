export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">About</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Hello! I'm Jonathan Mares, and this is my personal website where I write about the things I'm passionate about.
        </p>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          I'm interested in computer science, software engineering, and motorcycles. When I'm not coding or writing, 
          you can find me exploring the backroads on two wheels or tinkering with new projects.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">Interests</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Software Engineering & Architecture</li>
          <li>Computer Science</li>
          <li>Adventure Motorcycling</li>
          <li>Open Source Software</li>
        </ul>
      </div>
    </div>
  );
}

