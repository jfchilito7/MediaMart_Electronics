import { useState } from 'react'
import Layout from './layout'
import DataTable from './view/DataTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>
      <DataTable/>
    </Layout>
  )
}

export default App
