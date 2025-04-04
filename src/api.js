import axios from "axios";

const url = "https://api.coincap.io/v2/assets?limit=10";

export async function fetchData () {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch(error) {
        console.log("Error Fetching Data...", error);
        throw(error);
    }
}