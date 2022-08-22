import CustomLayout from './components/CustomLayout';
import Schedule from './components/Schedule';
import './styles/app.css';

function App() {
  return (
    <div className="container">
      <CustomLayout>
        <Schedule />
      </CustomLayout>
    </div>
  );
}

export default App;
