import React from "react";
import { useState, useEffect } from "react";
import "../src/styles/App.css";
import CurrencyChart from "./CurrencyChart";

const API = "https://api.frankfurter.app";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [mainCurrency, setMainCurrency] = useState("PLN");
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [date, setDate] = useState({
    From: "",
    To: "",
  });
  const [dataToShow, setDataToShow] = useState({});

  useEffect(() => getCurrencies(), []);

  const getCurrencies = () => {
    fetch(`${API}/currencies`)
      .then((response) => response.json())
      .then((data) => {
        const array = Object.keys(data);
        const objects = array.map((item) => ({ name: item, isChecked: false }));
        setCurrencies(objects);
      });
  };

  const toggleCheckAll = (e) => {
    setIsAllChecked(!isAllChecked);
    setCurrencies((prevState) =>
      prevState.map((item) => ({
        ...item,
        isChecked: e.target.checked,
      }))
    );
  };

  const handleDateInputs = (e) => {
    if (e.target.name === "from") {
      setDate((prevState) => ({
        ...prevState,
        From: e.target.value,
      }));
    }
    if (e.target.name === "to") {
      setDate((prevState) => ({
        ...prevState,
        To: e.target.value,
      }));
    }
  };
  const handleCheckboxes = (e) => {
    let currenciesCopy = [...currencies];
    const index = currenciesCopy.findIndex((item) => item.name === e.target.id);
    currenciesCopy[index].isChecked = !currenciesCopy[index].isChecked;

    setCurrencies(currenciesCopy);
  };

  const handleSelectMainCurrency = (e) => {
    setMainCurrency(e.target.options[e.target.selectedIndex].value);
  };

  const handleSubmitButton = () => {
    let checkedCurrencies = currencies
      .filter((item) => item.isChecked === true)
      .map((item) => item.name)
      .join(",");
    if (checkedCurrencies) {
      if (date.From === "") {
        fetch(`${API}/latest?from=${mainCurrency}&to=${checkedCurrencies}`)
          .then((response) => response.json())
          .then((data) => setDataToShow(data));
      } else {
        fetch(
          `${API}/${date.From}..${date.To}?from=${mainCurrency}&to=${checkedCurrencies}`
        )
          .then((response) => response.json())
          .then((data) => setDataToShow(data));
      }
    } else {
      alert("wybierz waluty do porównania");
    }
    resetStateOptions();
  };
  const resetStateOptions = () => {
    const select = document.getElementById("mainCurrency");
    setCurrencies((prevState) =>
      prevState.map((item) => ({
        ...item,
        isChecked: false,
      }))
    );
    setIsAllChecked(false);
    setMainCurrency("PLN");
    setDate({
      From: "",
      To: "",
    });
    select.options[0].selected = true;
  };
  const currenciesChecboxArr = currencies.map((currency) => (
    <div key={currency.name}>
      <label htmlFor={currency.name}>
        <input
          onChange={handleCheckboxes}
          id={currency.name}
          type="checkbox"
          name="currency"
          checked={currency.isChecked}
          value={currency.name}
        ></input>
        {currency.name}
      </label>
    </div>
  ));
  const currenciesSelectArr = currencies.map((currency) => (
    <option key={currency.name} value={currency.name}>
      {currency.name}
    </option>
  ));
  const isEmpty = Object.keys(dataToShow).length === 0;
  return (
    <div className="App">
      <div className="menu">
        <span>Wybierz walute(domyślnie PLN)</span>
        <select
          className="mainCurrency"
          id="mainCurrency"
          onChange={handleSelectMainCurrency}
        >
          <option>Wybierz walute</option>
          {currenciesSelectArr}
        </select>

        <span>Wybierz przedział czasowy(domyślnie najnowsze dane)</span>
        <span>Od:</span>
        <input
          className="dateInput"
          onChange={handleDateInputs}
          type="date"
          name="from"
          value={date.From}
        />
        <span>Do:</span>
        <input
          className="dateInput"
          onChange={handleDateInputs}
          type="date"
          name="to"
          value={date.To}
        />
      </div>

      <div className="checkboxes">
        <label htmlFor="checkAll">
          <input
            id="checkAll"
            type="checkbox"
            checked={isAllChecked}
            onChange={toggleCheckAll.bind(this)}
          />
          Zaznacz wszystkie
        </label>
        {currenciesChecboxArr}
      </div>
      <button className="submitButton" onClick={handleSubmitButton}>
        POKAŻ WYKRES
      </button>
      {isEmpty ? null : <CurrencyChart dataToShow={dataToShow}></CurrencyChart>}
    </div>
  );
};

export default App;
