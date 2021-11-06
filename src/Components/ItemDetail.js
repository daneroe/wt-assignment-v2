import "./ItemDetail.css"
import { useEffect, useState } from 'react';

export function ItemDetail() {

    // URL Details
    const BASE_URL = "http://localhost:56384";
    const DETAIL_SEARCH = "/api/RecallDetail?itemID=";
    const BASE_FRONTEND_URL = 'http://localhost:3000';

    // Extract Params from URL
    const QUERY_STRING = window.location.search;
    const URL_PARAMS = new URLSearchParams(QUERY_STRING);

    // Extract individual params
    let itemID = URL_PARAMS.get("itemID");
    let searchYear = URL_PARAMS.get("year");

    // Vars for view
    const [itemName, setItemName] = useState("");
    const [itemCost, setItemCost] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemImage, setItemImage] = useState("");
    const [customerDetails, setCustomerDetails] = useState([]);

    const fetchItemDetail = () => {

        // If year is empty set that part to blank
        const YEARPART = searchYear === "" ? "" : `&year=${searchYear}`;

        try {
            fetch(BASE_URL + DETAIL_SEARCH + itemID + YEARPART)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setItemName(data.item.itemName);
                    setItemCost(data.item.itemCost);
                    setItemDescription(data.item.itemDescription);
                    setCustomerDetails(data.customerList);
                    setItemImage(data.item.itemImage);
                })
        } catch (error) {
            console.log('failed', error);
        }
    }


    // Return to the recall page
    const returnClicked = () => {
        window.location.assign(BASE_FRONTEND_URL);
    }

    // Effects
    useEffect(() => {
        fetchItemDetail();
    }, []);

    return (
        <div>
            <div className="alert alert-primary">
                <h4 className="alert-primary">Recall Information</h4>
                <hr></hr>
                <div className="row">
                    <div className="col-9">
                        <h4><b>Product: </b>{itemName}</h4>
                        <h5><b>Unit Cost: </b>{itemCost}</h5>
                        <p><b>Description: </b>{itemDescription}</p>
                    </div>
                    <div className="col-3">
                        <img src={itemImage} alt={itemName} style={{ maxWidth: '100%' }}></img>
                    </div>
                </div>
            </div>

            <div className="mb-2 row">
                <div className="col-3">
                    <button onClick={(e) => returnClicked()} className="btn btn-outline-primary">Return to Recall Page</button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Contact Details</th>
                        <th scope="col">Address</th>
                        <th scope="col">Total Cost</th>
                        <th scope="col">Units Sold</th>
                    </tr>
                </thead>

                <tbody title="Customer Details">

                    {customerDetails.map((customer, key) =>
                        <tr key={key}
                        >
                            <td>{customer.customerName}</td>
                            <td>
                                {(customer.primaryPh !== '' && customer.primaryPh !== null) &&
                                    <div>
                                        {customer.primaryPh}<br></br>
                                    </div>
                                }
                                {(customer.secondaryPh !== '' && customer.secondaryPh !== null)  &&
                                    <div>
                                        {customer.secondaryPh}<br></br>
                                    </div>
                                }
                                {(customer.email !== '' && customer.email !== null) && 
                                    <div>
                                        {customer.email}
                                    </div>
                                }
                            </td>
                            <td>{customer.addressLine1}<br></br>
                                {customer.addressLine2}
                            </td>
                            <td>{"$" + customer.totalCost.toFixed(2)}</td>
                            <td>{customer.unitsSold}</td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

