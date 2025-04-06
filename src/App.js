import './App.css';
import { Auth } from './components/auth';
import  AddTestData  from './components/addTestData'




function App() {
    return(
<div className='App'><Auth/>

          <h1>Test dodawania danych</h1>
          <AddTestData />
        </div>
    );
    
}

export default App;

