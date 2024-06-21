import axios from "axios";
import React, {useState} from "react";
import Papa from 'papaparse';
import './App.css';
import * as cheerio from "cheerio";

function App() {
    const [state, setState] = useState('');
    let SetOnchange = (e) => {
        setState(e.target.value)
    }
    const url = `http://localhost:3000/api${state.replace('https://tuneapp.ru', '')}`

    const parseClick = async () => {
        const response = await axios.get(url)
        const html = response.data;
        const $ =cheerio.load(html)
        const products = [];
        $('.category__cards .product-card').each((index, element) => {
            const name = $(element).find('.product-card__name').text().trim();
           let price = $(element).find('div.product-card__info > div.product-card__full > div.product-card__full-right > div.product-card__price > p').text().trim();
        products.push({name,price});
        });
        const csvData = Papa.unparse(products);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'products.csv';
        link.click();
    }


    return (
        <div className="App">
            <input value={state} onChange={SetOnchange}/>
            <button onClick={parseClick}>parsing</button>

        </div>
    );
}

export default App;
