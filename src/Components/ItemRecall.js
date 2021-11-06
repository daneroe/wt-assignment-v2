import "./ItemRecall.css"
import { useEffect, useState } from 'react';

export function ItemRecall(props) {

  // Persisted Data
  let store = window.sessionStorage
  let storedItemData = JSON.parse(store.getItem('itemData')) || [];
  let storedQuery = store.getItem('query') || '';
  let storedYear = store.getItem("year") || '';

  // Set default state for our variables. Use persisted state if exists
  const [searchQuery, setSearchQuery] = useState(storedQuery);
  const [searchYear, setSearchYear] = useState(storedYear);
  const [validSearch, setValidSearch] = useState(true);

  // Set default state for items and years (Empty)
  const [years, setYears] = useState([]);
  const [items, setItems] = useState(storedItemData);
  const [itemNames, setItemNames] = useState([]);

  // Wrapper for setSearchQuery
  const setString = (query) => {
    store.setItem('query', query);
    setSearchQuery(query);
  }

  // Wrapper for setSearchYear
  const setYearSelect = (year) => {
    store.setItem('year', year);
    setSearchYear(year);
  }

  // URLs
  const BASE_URL = "http://localhost:56384";
  const RECALL_SEARCH = "/api/RecallSearch?searchText=";
  const YEAR_SEARCH = "/api/YearList";
  const NAME_LIST = "/api/NameList";
  const BASE_FRONTEND_URL = 'http://localhost:3000';

  const detailClicked = (item, year) => {
    let detailURL = BASE_FRONTEND_URL + `/detail?itemID=${item.itemID}&year=${year}`;
    window.location.assign(detailURL);
  }

  const fetchItemData = (query) => {

    // Check if search sring is valid
    if (query === null || query.length < 2) {
      setValidSearch(false);
      return;
    }

    // Fecth if so
    setValidSearch(true);

    const YEARPART = searchYear === "" ? "" : `&year=${searchYear}`;

    try {
      fetch(BASE_URL + RECALL_SEARCH + query + YEARPART)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setItems(data);
          store.setItem('itemData', JSON.stringify(data));
        })
    } catch (error) {
      console.log('failed', error);
    }
  }

  const fetchYears = () => {
    try {
      fetch(BASE_URL + YEAR_SEARCH)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setYears(data);
        })
    } catch (error) {
      console.log('failed', error);
    }
  }

  const fetchNames = () => {
    try {
      fetch(BASE_URL + NAME_LIST)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setItemNames(data);
        })
    } catch (error) {
      console.log('failed', error);
    }
  }

  // Effects
  useEffect(() => {
    fetchYears()
  }, []);

  useEffect(() => {
    fetchNames()
  }, []);


    return (
        <div>
            <div className="alert alert-warning text-center"><h2>Item Recall Search</h2></div>
            <div className="alert alert-danger">
                <h4 className="alert-heading">Warning</h4>
                <hr></hr>
                <b>All search activity on this page is logged</b><br></br>
                This page is only to be used for quickly locating customers of a product impacted by a product recall<br></br>
                Do not use this page to search and identify customers of regular shop purchases
            </div>

            <div className="mb-2 row">
                <div className="col-4">
                    <input className="form-control"
                        value={searchQuery}
                        onInput={(e) => setString(e.target.value)}
                        type='text'
                        list="itemNames"
                        placeholder="Begin typing to search"
                    />
                </div>

                <datalist id="itemNames" >
                    {itemNames.map((name, key) =>
                        <option key={key} value={name} />
                    )}
                </datalist>

                <div className="col-2">
                    <select
                        className="form-control"
                        id="searchYear"
                        value={searchYear}
                        onChange={e => setYearSelect(e.target.value)}
                    >
                        <option value=''>Select a year</option>
                        {years.map((year, key) =>
                            <option key={key} value={year}>{year}</option>
                        )}
                    </select>
                </div>

                <div className="col-2">
                    <button onClick={(e) => fetchItemData(searchQuery)} className="btn btn-outline-primary">Search</button>
                </div>
            </div>

            {!validSearch &&
                <div>
                    <p><b>Search must contain at least 2 charachters</b></p>
                </div>
            }

            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Item Name</th>
                        <th scope="col">Item Description</th>
                        <th scope="col">Item Cost</th>
                        <th scope="col">Category</th>
                        <th scope="col">Units Sold</th>
                        <th scope="col">Customers</th>
                    </tr>
                </thead>
                <tbody title="View Effected Customers">

                    {items.map((item) =>
                        <tr key={item.itemID}
                            onClick={(e) => detailClicked(item, searchYear)}
                        >
                            <td>{item.itemName}</td>
                            <td>{item.itemDescription}</td>
                            <td>{"$" + item.itemCost.toFixed(2)}</td>
                            <td>{item.itemCatName}</td>
                            <td>{item.unitsSold}</td>
                            <td>{item.customerCount}</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

