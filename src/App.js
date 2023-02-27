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

  const countryOptions = props.countries.map((c) =>
    <DropDownItem key={c.name} country={c} />);

  return (
    <select onChange={props.onChange}>
      {countryOptions}
    </select>
  )
};

function CalculateVat() {
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [rate, setRate] = useState();
  const [rateId, setRateId] = useState();
  const [calculatedRates, setCalculatedRates] = useState();

  const handleChange = (e, rateId) => {
    setRate(e.target.value);
    setRateId(rateId);
  };

  useEffect(() => {
    if (rate && countries.length !== 0) {
      calculate();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  useEffect(() => {
    if (countries.length === 0){
      getCountries();
    }
    else{
      calculate();
    }

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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


  return (
    <>
      <img src={logo} alt="logo lamp calculate" width="100" height="100" className='center'/>
      <h2>Calculate VAT</h2>
      <div>
        <form /*className={style.root}*/>
          <div className="SameLineTitle">
          <label> Country: </label>
          </div>
          <div class="SameLine">
          <CountriesDropdown countries={countries} onChange={e => setCountryId(e.target.value)} />
          </div>
          {countries && countryId && <RadioGroupRates countryId={countryId} handleChange={handleChange} />}

          <div className="SameLineTitle">
          <label> Price without VAT </label>
          </div>
          <div class="SameLine">
          <input
            labelText=""
          />
          </div>
          <div className="SameLineTitle">
          <label> Value Added Tax </label>
          </div>
          <div class="SameLine">
          <input
            labelText=""
          />
          </div>
          <div className="SameLineTitle">
          <label> Price incl. VAT </label>
          </div>
          <div class="SameLine">
          <input
            labelText=""
          />
          </div>
          
        </form>
        
      </div>
    </>
  );
}

export default CalculateVat;
