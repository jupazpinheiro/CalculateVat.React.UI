import logo from '../src/img/logo.jpg';
import './App.css';
import React, { useState, useEffect } from 'react';

const RadioButton = ({ rateId, label, value, onChange }) => {
  return (
    <label>
      <input name="rates" type="radio" value={value} onChange={(e) => onChange(e, rateId)} />
      {label}
    </label>
  );
};

const RadioGroupRates = (props) => {
  const [vats, setVats] = useState([]);

  const getVats = async () => {
    const response = await fetch(`https://localhost:7002/api/Vat/${props.countryId}`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    }).then((response) => response.json());



    setVats(response.rates);
  }
  useEffect(() => {
    getVats();
  }, [props.countryId]);

  

  const opts = vats?.map((v) =>
    <RadioButton
      key={v?.id}
      rateId={v?.id}
      label={v?.text}
      value={v?.value}
      onChange={props.handleChange}
    />);

  return (
    <div>
      {opts}
    </div>
  );
}

const DropDownItem = ({ country }) => {
  const itemName = country.name
  return (<option value={country.id}>{itemName}</option>)
}

const CountriesDropdown = (props) => {
  const [countries, setCountries] = useState([]);
  

  const getCountries = async () => {
    const response = await fetch("https://localhost:7002/api/Country", {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    }).then((response) => response.json());

    setCountries(response);
  };

  useEffect(() => {
    getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countryOptions = countries.map((c) =>
    <DropDownItem key={c.name} country={c} />);

  return (
    <select onChange={props.onChange}>
      {countryOptions}
    </select>
  )
};

function CalculateVat() {
  const [countryId, setCountryId] = useState(0);
  const [rate, setRate] = useState();
  const [rateId, setRateId] = useState();
  const [calculatedRates, setCalculatedRates] = useState();

  const handleChange = (e, rateId) => {
    debugger;
    setRate(e.target.value);
    setRateId(rateId);
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const calculate = async () => {
    const response = await fetch("https://localhost:7002/api/Product/Calculate", {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({vatRateId: rateId, vatRate: rate, priceType: 2, value: "10.00"}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    }).then((response) => response.json());

    setCalculatedRates(response);
  };

  return (
    <>
      <img src={logo} alt="logo lamp calculate" width="100" height="100" />
      <h2>Calculate VAT</h2>
      <div className="SameLine">
        <form /*className={style.root}*/>
          <label> Country: </label>
          <CountriesDropdown onChange={e => setCountryId(e.target.value)} />
          {countryId && <RadioGroupRates countryId={countryId} handleChange={handleChange} />}
          {/* <Input
            labelText="Amount"
            onChange={(e) => setAmount(e.target.value)}
            id="amount"
            type="number"
            value={amount}
            random
            isValid={amountIsValid}
            validationText="Please enter a number greater than 0"
          />
          <Input
            labelText="VAT Rate %"
            onChange={(e) => setVatRate(e.target.value)}
            id="vat-rate"
            type="number"
            value={vatRate}
            isValid={vatRateIsValid}
            validationText="Please enter a vat rate, e.g. 17.5"
          />
          <div className={style.buttonWrapper}>
            <Button onClick={() => scrollToResult(netRef)} importance="primary">
              Add VAT
            </Button>
            <div className={style.buttonDivider}>Or</div>
            <Button
              onClick={() => scrollToResult(grossRef)}
              importance="secondary"
            >
              Remove VAT
            </Button>
          </div> */}
        </form>
        {/* <div ref={netRef} id="net-results" className={style.result}>
          <h2>Results when adding vat</h2>
          <Input
            labelText="Net amount (excluding VAT)"
            id="net-amount"
            type="text"
            value={twoDecimals(amount)}
            readOnly
          />
          <Input
            labelText={`VAT at (${vatRate}%)`}
            id="vat-rate-2"
            type="text"
            value={twoDecimals(amountIncludingVat - Number(amount))}
            readOnly
          />
          <Input
            labelText="Gross amount (including VAT)"
            id="gross-amount"
            type="text"
            value={twoDecimals(amountIncludingVat)}
            readOnly
          />
        </div>
        <div ref={grossRef} id="gross-results" className={style.result}>
          <h2>Results when removing vat</h2>
          <Input
            labelText="Gross amount (including VAT)"
            id="gross-amount-2"
            type="text"
            value={twoDecimals(amount)}
            readOnly
          />
          <Input
            labelText={`VAT at (${vatRate}%)`}
            id="vat-rate-3"
            type="text"
            value={twoDecimals(Number(amount) - amountExcludingVat)}
            readOnly
          />
          <Input
            labelText="Net amount (excluding VAT)"
            id="net-amount-2"
            type="text"
            value={twoDecimals(amountExcludingVat)}
            readOnly
          />
        </div> */}
      </div>
    </>
  );
}

export default CalculateVat;
