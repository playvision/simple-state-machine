import './App.css';
import Flow from './Flow';
import { Flex, Text, Button } from '@radix-ui/themes';
import SimpleComponent from './SimpleComponent';


function App() {
  return (
    <div className="App">
      <Flow />
      <SimpleComponent />
      <Button>
        <Text>Hello</Text>
      </Button>
    </div>
  );
}

export default App;
