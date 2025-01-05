import AllSuggestions from '@/components/all-suggestions';

export default async function Home() {
  return (
      <main className="max-w-7xl mx-auto py-8 px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mom's Movie and Show Picks</h1>
          <p className="text-xl text-gray-600">
            Here are some great shows and movies I think you'll love, Mom!
          </p>
        </header>
        <AllSuggestions/>
       
      </main>
    )

}