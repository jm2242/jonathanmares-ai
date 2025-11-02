import Image from 'next/image';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#111111] dark:text-gray-100">About Me</h1>
      
      <div className="mb-8">
        <Image
          src="/images/about-photo.jpeg"
          alt="Jonathan Mares in a gondola with snowy mountain background"
          width={600}
          height={800}
          className="rounded-lg shadow-lg object-cover w-full max-w-md mx-auto"
          priority
        />
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          Hi! I'm Jonathan Mares. I'm currently based out of the East Bay in Northern California and am a software engineer at Google in Google Wallet.
        </p>

        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          Previously, I was an engineering manager at <a href="https://www.quorum.us/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Quorum</a>.
        </p>

        
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          Originally from Be'er Sheva, Israel, I grew up in New York and spent my college years at Cornell, studying Chemical Engineering and Computer Science. In my free time, I enjoy playing classical and jazz piano, soccer, mountain biking, motorcycles, and pretending to understand wine.
        </p>
        
        <p className="text-lg text-[#1a1a1a] dark:text-gray-300 leading-relaxed mb-6">
          If you'd like to reach me, you can write to me at <a href="mailto:contact@jonathanmares.com" className="text-blue-600 dark:text-blue-400 hover:underline">contact@jonathanmares.com</a>.
        </p>
      </div>
    </div>
  );
}

