import './App.css';
import { ItemRecall } from './Components/ItemRecall'
import { ItemDetail } from './Components/ItemDetail'
// import { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";

function App() {

  // Render
  return (
    <div className='container header'>
      <Switch>
        <Route exact path="/">
          <ItemRecall
          ></ItemRecall>
        </Route>
        <Route path="/detail">
          <ItemDetail></ItemDetail>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
