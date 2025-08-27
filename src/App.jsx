import SamudayikAwaaz from './components/SamudayikAwaaz'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="App">
        <SamudayikAwaaz />
      </div>
    </AppProvider>
  )
}

export default App