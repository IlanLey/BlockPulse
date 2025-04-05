import { useState, useEffect } from "react";
import { fetchData } from "./api";
import { DollarSign, TrendingUp, BarChart2, Search } from "lucide-react";

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setCryptoData(result.data);
        setFilterData(result.data); // Initialize filterData with the fetched data
        console.log("Received Data...", result);
      } catch (error) {
        console.log("Error Receiving Data...", error);
      }
    };
    getData();
  }, []);

  const handleInput = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const newData = cryptoData.filter((coin) =>
      coin.name.toLowerCase().startsWith(searchTerm) ||
      coin.symbol.toLowerCase().startsWith(searchTerm)
    );

    setFilterData(newData);
  };

  const calculateTotalMarketCap = () => {
    if (cryptoData.length === 0) return "No data available";

    const totalMarketCap = cryptoData.reduce(
      (sum, coin) => sum + parseFloat(coin.marketCapUsd),
      0
    );

    const inTrillions = totalMarketCap / 1e12;
    return `${inTrillions.toFixed(2)}T`;
  };

  const calculateAverageChange = () => {
    if (cryptoData.length === 0) return "No data available";

    const totalAverageChange = cryptoData.reduce(
      (sum, coin) => sum + parseFloat(coin.changePercent24Hr),
      0
    );
    const averageDayChange = (totalAverageChange / cryptoData.length).toFixed(2);

    return averageDayChange > 0
      ? `+${averageDayChange}%`
      : `${averageDayChange}%`;
  };

  const topPerformer = () => {
    if (cryptoData.length === 0) return "No data available";

    const sortedCrypto = [...cryptoData].sort(
      (a, b) => b.changePercent24Hr - a.changePercent24Hr
    );

    const topCoin = sortedCrypto[0];
    if (!topCoin) return "No data available";

    return `${topCoin.name} (${topCoin.symbol})`;
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="text-5xl font-bold mb-2 font-display">Block Pulse</div>
        <div className="text-lg text-gray-400">
          Track and analyze your favorite cryptocurrencies
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="flex items-center bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <DollarSign className="text-green-400 w-10 h-10 mr-4" />
          <div>
            <div className="text-sm text-gray-400">Total Market Cap</div>
            <div className="text-3xl font-bold">{calculateTotalMarketCap()}</div>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <TrendingUp className="text-violet-800 w-10 h-10 mr-4" />
          <div>
            <div className="text-sm text-gray-400">Average 24h Change</div>
            <div className="text-3xl font-bold">{calculateAverageChange()}</div>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <BarChart2 className="text-green-400 w-10 h-10 mr-4" />
          <div>
            <div className="text-sm text-gray-400">Highest Performer Today</div>
            <div className="text-3xl font-bold">{topPerformer()}</div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="flex justify-center">
        <div className="flex items-center bg-gray-800 p-4 rounded-lg border border-slate-800 w-full max-w-md">
          <Search className="text-gray-400 w-6 h-6 mr-3" />
          <input
            type="search"
            onChange={handleInput}
            placeholder="Search by name or symbol"
            className="bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md w-full"
          />
        </div>
      </section>

      <section className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 mt-8 max-w-4xl mx-auto">
        {/* Header Row */}
        <div className="flex text-gray-300 font-bold border-b border-gray-700 pb-4 mb-4 text-lg tracking-wide">
          <div className="flex-1">Coin</div>
          <div className="flex-1 text-right">Price</div>
          <div className="flex-1 text-right">24h Change</div>
          <div className="flex-1 text-right">Market Cap</div>
        </div>

        {/* Dynamic Rows or Fallback */}
        {filterData.length > 0 ? (
          filterData.map((coin) => (
            <div
              key={coin.id}
              className="flex text-white items-center py-3 hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex-1 font-medium">{coin.name} ({coin.symbol})</div>
              <div className="flex-1 text-right font-mono">${parseFloat(coin.priceUsd).toFixed(2)}</div>
              <div
                className={`flex-1 text-right font-mono ${
                  parseFloat(coin.changePercent24Hr) > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {parseFloat(coin.changePercent24Hr).toFixed(2)}%
              </div>
              <div className="flex-1 text-right font-mono">${(coin.marketCapUsd / 1e9).toFixed(2)}B</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-4">No results found</div>
        )}
      </section>
    </div>
  );
}

export default App;
