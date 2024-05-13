import './App.css';
import Flow from './Flow';
import { Box } from '@radix-ui/themes';


function App() {
  return (
    // how to create app full screen height
    <Box className="App" style={{height: '100vh'}}>
      <Flow />
    </Box>
  );
}

export default App;
