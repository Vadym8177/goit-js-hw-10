import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputValueLink = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputValueLink.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange() {
  const inputValue = inputValueLink.value;
  if (inputValue.trim() === '') {
    clearCountryList();
    clearCountyInfo();
    return;
  }
  fetchCountries(inputValue.trim())
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryList();
        clearCountyInfo();
        return;
      }
      if (data.length >= 2 || data.length <= 10) {
        countryList.innerHTML = data
          .map(country => createCountryList(country))
          .join('');
        clearCountyInfo();
      }
      if (data.length === 1) {
        countryInfo.innerHTML = data
          .map(country => createCountryInfo(country))
          .join('');
        clearCountryList();
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearCountryList();
      clearCountyInfo();
    });
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountyInfo() {
  countryInfo.innerHTML = '';
}

function createCountryList({ flags, name }) {
  return `<li class="country-list__item">
  <img src="${flags.svg}" alt="${name}" width="25"/>
  <h2 class="country-list__title">${name}</h2>
</li>`;
}

function createCountryInfo({ flags, name, capital, population, languages }) {
  return `<div class="country-info__box"><img src="${
    flags.svg
  }" alt="${name}" width="30"/>
    <h2 class="country-info__title">${name}</h2></div>
    <p><span class="country-info__list">Capital:</span>${capital}</p>
      <p><span class="country-info__list">Population:</span>${population}</p>
      <p><span class="country-info__list">Languages:</span>${languages.map(
        language => language.name
      )}`;
}
