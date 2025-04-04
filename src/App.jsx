import { useState } from "react";
import { useEffect } from "react"
import { fetchData } from "./api"
import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';


function App() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setCryptoData(result.data);

        console.log("Received Data...", result);
      } catch(error) {
        
        console.log("Error Receiving Data...", error);
      }
    }
    getData();
  }, []);

  const calculateTotalMarketCap = () => {
    if (cryptoData.length === 0) return "No data available";
    
    const totalMarketCap = cryptoData.reduce(
      (sum, coin) => (sum + parseFloat(coin.marketCapUsd)), 
      0 
    );

    const inTrillions = totalMarketCap / 1e12;
    return `${inTrillions.toFixed(2)}T`;
  }

  const calculateAverageChange = () => {
    if (cryptoData.length === 0) return "No data available";

    const totalAverageChange = cryptoData.reduce(
      (sum, coin) => (sum + parseFloat(coin.changePercent24Hr)) , 0
    )
    const averageDayChange = (totalAverageChange / cryptoData.length).toFixed(2)
    
    if (averageDayChange > 0) { return '+' + averageDayChange + '%'; }
    else { return '-' + averageDayChange + '%' }
  }


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
    <div className="bg-black text-white min-h-screen p-10">

      <header className="mb-8">
        <div className="text-5xl font-bold mb-2 font-display">Block Pulse</div>
        <div className="text-lg text-gray-400">Track and analyze your favorite cryptocurrencies</div>
      </header>

      <section className="">
        <div className="flex ">
          <DollarSign className="text-green-400"/>
          <div>
            <div>Total Market Cap</div>
            <div>{calculateTotalMarketCap()}</div>
          </div>
        </div>

        <div>
          <TrendingUp className="text-green-400" />
          <div>
            <div>Average 24h Change</div>
            <div>{calculateAverageChange()}</div>
          </div>
        </div>

        <div>
          <BarChart2 className="text-green-400" />
          <div>
            <div>Highest Performer Today</div>
            <div>{topPerformer()}</div>
          </div>
        </div>

      </section>
      
    </div>
  )
}

export default App
